// LIGHT THE ROOM — the storyboard hero as a real-time scene where Lumen is an actual light source.
// Loaded lazily by Hero.jsx; everything here lives in its own chunk.
// No post-processing: the composer rendered black on integrated AMD GPUs, and the room reads fine without it.
// frameloop="demand": a frame is drawn only when scroll, the pointer or an animation actually changes something.
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Html, Lightformer, Line } from '@react-three/drei';
import { easing } from 'maath';
import Room, { GROUPS, H, LAMP, TABLE, WIN, SOFA, W, D } from './Room.jsx';
import { lumen3d, markWarmed, debugInfo } from './store.js';
import { gpuInfo } from './support.js';
import { heroCopy } from '../data.js';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const DEG = Math.PI / 180;

/* ---------- camera: one keyframe per scene on a Catmull-Rom path ---------- */
const CAM = [
  { p: [0.3, 2.5, -0.6], t: [0, 2.35, -2.3] },    // 01 close on the cord
  { p: [1.1, 2.05, 2.5], t: [0, 1.35, -2.6] },    // 02 pulling back as the drawing appears
  { p: [2.7, 2.1, 2.1], t: [-0.2, 1.15, -2.9] },  // 03 three-quarter view for the dimensions
  { p: [1.0, 1.45, 2.0], t: [0, 1.25, -2.9] },    // 04 into the room as the light comes on
  { p: [0, 0.75, 2.8], t: [0, 0.7, -4.6] },       // 05 the poster: low, facing the window, Lumen high in the frame above the title
];
// portrait screens: the same story from inside the room, so the floor fills the tall frame
const CAM_PORTRAIT = [
  CAM[0],
  { p: [0.5, 1.9, -0.2], t: [0, 1.3, -3] },
  { p: [1.3, 1.9, -0.4], t: [-0.3, 1.0, -3] },
  { p: [0.45, 2.45, -0.05], t: [0, 0.75, -3.6] },
  { p: [0, 1.5, -0.05], t: [0, 0.45, -5] },
];
const curves = (cams) => ({
  pos: new THREE.CatmullRomCurve3(cams.map((c) => new THREE.Vector3(...c.p)), false, 'centripetal'),
  tgt: new THREE.CatmullRomCurve3(cams.map((c) => new THREE.Vector3(...c.t)), false, 'centripetal'),
});
const LANDSCAPE = curves(CAM), PORTRAIT = curves(CAM_PORTRAIT);
const KNOTS = [0.06, 0.3, 0.5, 0.7, 0.9]; // scroll progress at which each keyframe is reached
function curveU(v) {
  const x = Math.min(0.9999, Math.max(0, v)) * 5, i = Math.floor(x), u = x - i;
  if (i >= 4) return 1;
  const t = Math.min(1, Math.max(0, (u - 0.55) / 0.45)), e = t * t * (3 - 2 * t);
  return (i + e) / 4;
}

/* switch-on flicker, same as the SVG lamp: 0 → 1 → .6 → 1 over 400 ms */
function flicker(t) {
  if (t < 0 || t > 0.4) return 1;
  const k = t / 0.4;
  return k < 0.35 ? k / 0.35 : k < 0.65 ? 1 - ((k - 0.35) / 0.3) * 0.4 : 0.6 + ((k - 0.65) / 0.35) * 0.4;
}

/* surface fade between "line drawing" (depth only — hides lines behind it) and full material */
function setFill(m, f) {
  const on = f > 0.002, tr = f < 0.998;
  if (m.colorWrite !== on) m.colorWrite = on;
  if (m.transparent !== tr) { m.transparent = tr; m.needsUpdate = true; }
  m.opacity = f;
}

/* ---------- SC 03 dimension lines ---------- */
function Dim({ a, b, label, tick = [0, 0.08, 0] }) {
  const mid = a.map((v, i) => (v + b[i]) / 2);
  const t = (p, s) => [p.map((v, i) => v - tick[i] * s), p.map((v, i) => v + tick[i] * s)];
  return (
    <group>
      <Line points={[a, b]} color="#FF6F59" lineWidth={1.5} />
      <Line points={t(a, 1)} color="#FF6F59" lineWidth={1.5} />
      <Line points={t(b, 1)} color="#FF6F59" lineWidth={1.5} />
      <Html position={mid} center zIndexRange={[20, 10]}><span className="dim3d">{label}</span></Html>
    </group>
  );
}
function Dims() {
  return (
    <group>
      <Dim a={[-WIN.w / 2, 3.42, -D + 0.08]} b={[WIN.w / 2, 3.42, -D + 0.08]} label="2 800" />
      <Dim a={[TABLE.x - TABLE.r, TABLE.h + 0.03, TABLE.z]} b={[TABLE.x + TABLE.r, TABLE.h + 0.03, TABLE.z]} label="Ø 1 300" tick={[0, 0, 0.08]} />
    </group>
  );
}

/* ---------- the scene ---------- */
// mode: 'warm' (compiling, under the preloader) → 'probe' (120 timed frames, first visit only) → 'live'
function Scene({ p, sceneRef, sc, small, touch, ready, lampOn, toggleLamp, setHover, pointer, live, onDecided, needProbe, invRef, inView }) {
  const { camera, size, gl, scene, clock, invalidate } = useThree();
  const reg = useMemo(() => ({
    groups: Object.fromEntries(GROUPS.map((g) => [g, { mats: new Set(), edge: new THREE.LineBasicMaterial({ color: '#D6CCFF', transparent: true, opacity: 0, depthWrite: false }) }])),
    lamp: {},
  }), []);
  const S = useRef({
    mode: 'compile', warm: 0, probe: [], last: 0,
    fill: Object.fromEntries(GROUPS.map((g) => [g, 0])),
    look: new THREE.Vector3(...CAM[0].t), pos: new THREE.Vector3(), tgt: new THREE.Vector3(),
    pow: 0, wasOn: false, flickered: false, flickT: -9, hemi: 2.3, sun: 0, specT: -9, born: -1,
    sw: { x: 0, z: 0, vx: 0, vz: 0 }, v3: new THREE.Vector3(), v4: new THREE.Vector3(),
  }).current;
  const hemi = useRef(), sun = useRef(), sunTarget = useRef(), cord = useRef(), cordLine = useRef();
  const dusk = useMemo(() => ({ warm: new THREE.Color('#FFF1E0'), cool: new THREE.Color('#9FA6D8') }), []);

  useEffect(() => { invRef.current = invalidate; }, [invalidate]);
  useEffect(() => { if (sc === 2) { S.specT = clock.elapsedTime; invalidate(); } }, [sc]);
  useEffect(() => { invalidate(); }, [lampOn, ready, live]);
  useEffect(() => { camera.position.set(...CAM[0].p); camera.lookAt(S.look); }, []);
  // scroll drives the camera: one frame per scroll change, only while the hero is on screen
  useEffect(() => p.on('change', () => { if (inView.current) invalidate(); }), [p]);

  // compile every shader up front (in parallel where KHR_parallel_shader_compile exists), yielding between passes
  useEffect(() => {
    let dead = false;
    (async () => {
      await new Promise((r) => setTimeout(r, 0));
      const mats = [];
      Object.values(reg.groups).forEach((g) => g.mats.forEach((m) => mats.push([m, m.colorWrite, m.transparent])));
      if (reg.lamp.spot) reg.lamp.spot.intensity = 7; // compile with the lights as they will be when lit
      for (const tr of [true, false]) {
        if (dead) return;
        mats.forEach(([m]) => { m.colorWrite = true; m.transparent = tr; m.needsUpdate = true; });
        try { await gl.compileAsync(scene, camera); } catch { gl.compile(scene, camera); }
        await new Promise((r) => setTimeout(r, 0));
      }
      mats.forEach(([m, c, t]) => { m.colorWrite = c; m.transparent = t; m.needsUpdate = true; });
      S.mode = 'warm';
      invalidate(); // a few real frames finish the job (uniform uploads, shadow maps)
    })();
    return () => { dead = true; };
  }, []);

  useFrame((state, dt) => {
    dt = Math.min(dt, 0.05);
    const now = state.clock.elapsedTime;
    let more = false; // does anything still need another frame?

    /* ---- warm-up / probe: render the full lit room, continuously, under the preloader ---- */
    if (S.mode !== 'live') {
      if (S.mode === 'compile') return;
      if (S.mode === 'warm') {
        S.warm++;
        if (S.warm > 8) {
          markWarmed();
          if (needProbe) { S.mode = 'probe'; S.probe = []; S.last = performance.now(); }
          else { S.mode = 'live'; onDecided('3d', null); }
        }
      } else if (S.mode === 'probe') {
        const t = performance.now(); S.probe.push(t - S.last); S.last = t;
        if (S.probe.length >= 130) {
          const f = S.probe.slice(10), fps = 1000 / (f.reduce((a, b) => a + b, 0) / f.length);
          window.__fps3d = Math.round(fps);
          S.mode = 'live';
          onDecided(fps < (small ? 45 : 30) ? 'photo' : '3d', fps);
        }
      }
      if (S.mode !== 'live') {
        GROUPS.forEach((g) => { reg.groups[g].edge.visible = true; reg.groups[g].edge.opacity = 0.3; reg.groups[g].mats.forEach((m) => setFill(m, S.warm % 2 && S.mode === 'warm' ? 0.5 : 1)); });
        if (reg.lamp.spot) reg.lamp.spot.intensity = 7;
        if (reg.lamp.point) reg.lamp.point.intensity = 1.4;
        if (sun.current) sun.current.intensity = 4;
        invalidate();
        return;
      }
      if (sun.current) sun.current.intensity = 0;
    }

    if (S.born < 0 && ready) S.born = now; // the cord starts drawing once the preloader has lifted
    const v = clamp01(p.get());
    const i = sceneRef.current;            // hysteretic scene index, shared with the HTML storyboard
    const u = clamp01(v * 5 - i);
    const L = reg.lamp;

    /* camera glides along the path */
    const cu = curveU(v);
    const aspect = size.width / size.height, path = aspect < 1 ? PORTRAIT : LANDSCAPE;
    path.pos.getPoint(cu, S.pos); path.tgt.getPoint(cu, S.tgt);
    easing.damp3(camera.position, S.pos, 0.35, dt);
    easing.damp3(S.look, S.tgt, 0.35, dt);
    camera.lookAt(S.look);
    if (camera.position.distanceToSquared(S.pos) > 1e-7 || S.look.distanceToSquared(S.tgt) > 1e-7) more = true;
    const fov = aspect < 1 ? Math.min(62, 2 * Math.atan(Math.tan(22 * DEG) / aspect) / DEG) : 35;
    const offT = aspect > 1.05 && i < 4 ? -camera.getFilmWidth() * 0.18 : 0; // shift the image right by 18% of the frame
    const off = THREE.MathUtils.damp(camera.filmOffset, offT, 2.2, dt);
    if (Math.abs(off - offT) > 0.01) more = true;
    if (Math.abs(camera.fov - fov) > 0.01 || Math.abs(camera.filmOffset - off) > 1e-4) { camera.fov = fov; camera.filmOffset = Math.abs(off - offT) > 0.01 ? off : offT; camera.updateProjectionMatrix(); }

    /* SC 01: one coral line — the cord — drawn down from the ceiling */
    const cordDraw = S.born < 0 ? 0 : clamp01((now - S.born - 0.3) / 1.6);
    if (cordDraw < 1 && S.born >= 0) more = true;
    if (cord.current) {
      cord.current.scale.y = Math.max(0.001, 1 - (1 - cordDraw) ** 3);
      const co = i === 0 ? 1 : i === 1 ? 1 - clamp01(u / 0.3) : 0;
      cord.current.visible = co > 0.01;
      if (cordLine.current) cordLine.current.material.opacity = co;
    }

    /* edges: nothing → drawn in group by group → spec → a 10% ghost once the room is real */
    const h = clamp01((v - 0.95) / 0.05); // hand-off to the SVG Lumen
    const ghost = lampOn ? 0.1 : 0.35;
    GROUPS.forEach((g, k) => {
      let e = 0;
      if (i === 1) e = clamp01((u - k * 0.12) / 0.22);
      else if (i === 2) e = 1;
      else if (i === 3) e = 1 + (ghost - 1) * clamp01(u / 0.35);
      else if (i === 4) e = ghost;
      if (g === 'lamp') e *= 1 - h;
      reg.groups[g].edge.opacity = e * 0.7; // the same line as the hand-drawn room: --line at 70%
      reg.groups[g].edge.visible = e > 0.004;

      /* fills: SC 03 fills brass, travertine, bouclé as each chip lands; SC 04 fills the rest */
      let f = 0;
      const since = now - S.specT;
      if (i === 2) { f = { lamp: since > 0.85, table: since > 0.97, sofa: since > 1.09 }[g] ? 1 : 0; if (since < 1.2) more = true; }
      else if (i === 3) f = ['lamp', 'table', 'sofa'].includes(g) ? 1 : clamp01(u / 0.35);
      else if (i === 4) f = 1;
      const direct = i === 3 && !['lamp', 'table', 'sofa'].includes(g);
      S.fill[g] = direct ? f : THREE.MathUtils.damp(S.fill[g], f, 7, dt);
      if (Math.abs(S.fill[g] - f) > 0.002) more = true; else S.fill[g] = f;
      const ff = g === 'lamp' ? S.fill[g] * (1 - h) : S.fill[g];
      reg.groups[g].mats.forEach((m) => setFill(m, ff));
    });

    /* Lumen switches on — the flicker plays once, the first time the room is lit */
    const want = i >= 3 && lampOn;
    if (want && !S.wasOn && !S.flickered) { S.flickT = now; S.flickered = true; }
    S.wasOn = want;
    const powT = want ? 1 : 0;
    S.pow = want ? 1 : THREE.MathUtils.damp(S.pow, 0, 6, dt);
    if (Math.abs(S.pow - powT) > 0.002) more = true; else S.pow = powT;
    if (now - S.flickT < 0.45) more = true;
    const pw = S.pow * flicker(now - S.flickT);
    if (L.spot) L.spot.intensity = 7 * pw;
    if (L.point) L.point.intensity = 1.4 * pw;
    if (reg.bulbMat) reg.bulbMat.emissiveIntensity = 7 * pw + 0.05;

    // swings with the cursor (idle sway on touch); settles straight over p .90–.94, before the hand-off crossfade
    const interactive = i >= 3, settle = 1 - clamp01((v - 0.9) / 0.04);
    let tz = 0, tx = 0;
    if (interactive) {
      tz = -pointer.current.x * 12 * DEG; tx = pointer.current.y * 7 * DEG; // cursor on desktop, finger drag on touch
      tz *= settle; tx *= settle;
    }
    const sw = S.sw;
    sw.vz += ((tz - sw.z) * 14 - sw.vz * 3.2) * dt; sw.z += sw.vz * dt;
    sw.vx += ((tx - sw.x) * 14 - sw.vx * 3.2) * dt; sw.x += sw.vx * dt;
    if (Math.abs(sw.vz) + Math.abs(sw.vx) + Math.abs(tz - sw.z) + Math.abs(tx - sw.x) > 1e-4) more = true;
    if (L.group) L.group.rotation.set(sw.x, 0, sw.z);
    if (L.target) L.target.position.set(interactive ? pointer.current.x * 1.3 * settle : 0, -H, interactive ? -pointer.current.y * 0.9 * settle : 0);
    if (L.spot && L.target && L.spot.target !== L.target) L.spot.target = L.target;

    /* ambient (never below a readable floor), evening sun through the window, environment for the brass */
    const hemiT = i <= 2 ? 2.3 : lampOn ? 1.05 : 0.7;
    S.hemi = THREE.MathUtils.damp(S.hemi, hemiT, 4, dt);
    if (Math.abs(S.hemi - hemiT) > 0.003) more = true; else S.hemi = hemiT;
    if (hemi.current) {
      hemi.current.intensity = S.hemi;
      hemi.current.color.lerpColors(dusk.cool, dusk.warm, i >= 3 && !lampOn ? 0.2 : 1);
    }
    const sunT = i === 4 ? 4 : i === 3 ? 1.4 : 0;
    S.sun = THREE.MathUtils.damp(S.sun, sunT, 3, dt);
    if (Math.abs(S.sun - sunT) > 0.003) more = true; else S.sun = sunT;
    if (sun.current) { sun.current.intensity = S.sun; if (sunTarget.current) sun.current.target = sunTarget.current; }
    scene.environmentIntensity = i >= 3 ? 0.3 : 0.5;

    /* hand-off: project the shade centre to the screen for the SVG Lumen */
    if (L.centre) {
      L.centre.getWorldPosition(S.v3);
      S.v4.setFromMatrixColumn(camera.matrixWorld, 0).multiplyScalar(LAMP.shadeR).add(S.v3);
      S.v3.project(camera); S.v4.project(camera);
      const r = gl.domElement.getBoundingClientRect();
      lumen3d.x = r.left + ((S.v3.x + 1) / 2) * r.width;
      lumen3d.y = r.top + ((1 - S.v3.y) / 2) * r.height;
      lumen3d.r = Math.abs(S.v4.x - S.v3.x) / 2 * r.width;
      lumen3d.handoff = h;
      lumen3d.active = live;
      lumen3d.emit();
    }

    if (more && inView.current) invalidate();
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={['#FFF1E0', '#5E4E6E', 2.3]} />
      <object3D ref={sunTarget} position={[0.9, 0, -1.6]} />
      <directionalLight ref={sun} position={[-1.6, 4.4, -9.5]} color="#FFB37C" intensity={0} castShadow
        shadow-mapSize={[1024, 1024]} shadow-bias={-0.0003} shadow-normalBias={0.03}
        shadow-camera-left={-4.5} shadow-camera-right={4.5} shadow-camera-top={4.5} shadow-camera-bottom={-4.5} shadow-camera-near={1} shadow-camera-far={16} />
      <Environment resolution={64} frames={1} environmentIntensity={0.4}>
        <color attach="background" args={['#5A4C4A']} />
        <Lightformer form="rect" intensity={2.2} color="#FFE3C6" position={[0, 2, -6]} scale={[4, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#F7F3FF" position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[6, 6, 1]} />
        <Lightformer form="rect" intensity={0.6} color="#B8A6FF" position={[-5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} scale={[5, 3, 1]} />
      </Environment>
      <Room reg={reg} small={small}
        onLampClick={(e) => { e.stopPropagation(); if (sc >= 3) toggleLamp(); }}
        onLampHover={(o) => setHover(o && sc >= 3)} />
      <group ref={cord} position={[LAMP.x, H, LAMP.z]}>
        <Line ref={cordLine} points={[[0, 0, 0], [0, -LAMP.cord - LAMP.shadeH / 2, 0]]} color="#FF6F59" lineWidth={2.2} transparent />
      </group>
      {sc === 2 && <Dims />}
    </>
  );
}

/* ---------- the stage: ONE canvas, created once, never remounted while scrolling ---------- */
export default function Stage3D({ p, sceneRef, sc, small, touch, ready, needProbe, live, onDecided, onContextLost, onContextRestored }) {
  const wrap = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const invRef = useRef(() => {});
  const inView = useRef(true);
  const [lampOn, setLampOn] = useState(true);
  const [hover, setHover] = useState(false);
  const [moved, setMoved] = useState(false);
  const gpu = gpuInfo();
  // integrated GPUs (like AMD Radeon Graphics APUs) get a lighter budget
  const dpr = small ? 1 : gpu.integrated ? [1, 1.25] : [1, 1.5];

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { inView.current = e.isIntersecting; if (e.isIntersecting) invRef.current(); }, { rootMargin: '100px' });
    io.observe(wrap.current);
    return () => { io.disconnect(); lumen3d.active = false; lumen3d.emit(); };
  }, []);

  // touch: drag across the stage to swing Lumen, tap to switch it (the page still scrolls vertically: touch-action pan-y)
  useEffect(() => {
    if (!touch) return;
    const el = wrap.current;
    let x0 = 0, y0 = 0, t0 = 0, dragging = false;
    const down = (e) => { x0 = e.clientX; y0 = e.clientY; t0 = performance.now(); dragging = true; };
    const move = (e) => {
      if (!dragging || sceneRef.current < 3) return;
      pointer.current.x = Math.max(-1, Math.min(1, (e.clientX - x0) / (window.innerWidth * 0.35)));
      pointer.current.y = 0;
      invRef.current();
      if (!moved) setMoved(true);
    };
    const up = (e) => {
      dragging = false;
      const tap = Math.hypot(e.clientX - x0, e.clientY - y0) < 10 && performance.now() - t0 < 350;
      if (tap && sceneRef.current >= 3 && !e.target.closest('a, button')) { setLampOn((o) => !o); setMoved(true); }
      pointer.current.x = 0; invRef.current();
    };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', () => { dragging = false; pointer.current.x = 0; invRef.current(); });
    return () => { el.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [touch, moved]);

  useEffect(() => {
    if (touch) return;
    const move = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (sceneRef.current >= 3 && inView.current) invRef.current();
      if (sc === 4 && !moved) setMoved(true);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [sc, touch, moved]);

  return (
    <div ref={wrap} className={'stage3d' + (live ? ' on' : '') + (hover ? ' hover' : '')}>
      <Canvas frameloop="demand" dpr={dpr} shadows
        camera={{ fov: 35, near: 0.05, far: 60, position: CAM[0].p }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMappingExposure = 1.15;
          gl.debug.checkShaderErrors = false; // skips the (slow) driver info-log round trip; shaders are fixed and tested
          const el = gl.domElement;
          el.setAttribute('role', 'img');
          el.setAttribute('aria-label', heroCopy.roomAlt);
          debugInfo.webgl++;
          el.addEventListener('webglcontextlost', (e) => { e.preventDefault(); debugInfo.contextLost++; console.info('[samskriti] WebGL context lost — showing the photo hero'); onContextLost(); });
          el.addEventListener('webglcontextrestored', () => { console.info('[samskriti] WebGL context restored'); onContextRestored(); invRef.current(); });
        }}>
        <Suspense fallback={null}>
          <Scene p={p} sceneRef={sceneRef} sc={sc} small={small} touch={touch} ready={ready} lampOn={lampOn}
            toggleLamp={() => { setLampOn((o) => !o); setMoved(true); }}
            setHover={setHover} pointer={pointer} live={live} onDecided={onDecided} needProbe={needProbe} invRef={invRef} inView={inView} />
        </Suspense>
      </Canvas>
      <p className={'hint3d note' + (live && sc === 4 && !moved ? ' on' : '')} aria-hidden="true">
        {touch ? heroCopy.hintTouch : heroCopy.hint}
      </p>
    </div>
  );
}
