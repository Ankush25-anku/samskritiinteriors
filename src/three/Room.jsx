// The hero room, modelled procedurally in real-world metres (no downloaded models).
// Shell 6.4 w × 3.6 h × 5 d, open towards the camera (z = 0); back wall at z = −5.
// Every solid also carries its feature edges (15°), so the same model can be shown as a line drawing,
// as a spec with some materials filled in, or as the finished room. Stage3D drives that per group.
import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { noiseNormal, oakTexture, skyTexture } from './textures.js';

export const W = 6.4, H = 3.6, D = 5;
export const WIN = { w: 2.8, sill: 0.35, spring: 1.85 };           // window: width, sill, where the arch starts
export const TABLE = { x: 0, z: -2.3, r: 0.65, h: 0.38 };
export const LAMP = { x: 0, z: -2.3, cord: 1.8, shadeH: 0.2, shadeR: 0.26 }; // hangs from the ceiling
export const SOFA = { R: 4, len: 3.2, z: -3.75, n: 7 };
export const GROUPS = ['shell', 'window', 'decor', 'sofa', 'table', 'lamp']; // also the draw-in order

/* ---------- shapes ---------- */
function archPath(p, w, y0, spring, reverse = false) {
  const r = w / 2;
  if (!reverse) {
    p.moveTo(-r, y0); p.lineTo(r, y0); p.lineTo(r, spring); p.absarc(0, spring, r, 0, Math.PI, false); p.lineTo(-r, y0);
  } else {
    p.moveTo(-r, y0); p.lineTo(-r, spring); p.absarc(0, spring, r, Math.PI, 0, true); p.lineTo(r, y0); p.lineTo(-r, y0);
  }
  return p;
}
function archShape(w, y0, spring) { return archPath(new THREE.Shape(), w, y0, spring); }
function archRing(w, y0, spring, t) {
  const s = archShape(w + 2 * t, y0 - t, spring);
  s.holes.push(archPath(new THREE.Path(), w, y0, spring, true));
  return s;
}
function wallWithWindow() {
  const s = new THREE.Shape();
  s.moveTo(-W / 2, 0); s.lineTo(W / 2, 0); s.lineTo(W / 2, H); s.lineTo(-W / 2, H); s.lineTo(-W / 2, 0);
  s.holes.push(archPath(new THREE.Path(), WIN.w, WIN.sill, WIN.spring, true));
  return new THREE.ExtrudeGeometry(s, { depth: 0.3, bevelEnabled: false, curveSegments: 40 });
}
function lathe(points, segs = 48) { return new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), segs); }

/* ---------- one solid: surface + its 15° feature edges (edgeGeo: a cleaner stand-in for the drawing) ---------- */
function Solid({ reg, g, geo, edgeGeo, mat, cast = false, receive = false, onClick, onPointerOver, onPointerOut, ...rest }) {
  const edges = useMemo(() => new THREE.EdgesGeometry(edgeGeo || geo, 20), [geo, edgeGeo]);
  return (
    <group {...rest}>
      <mesh geometry={geo} material={mat} castShadow={cast} receiveShadow={receive} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut} />
      <lineSegments geometry={edges} material={reg.groups[g].edge} renderOrder={2} />
    </group>
  );
}

export default function Room({ reg, small, onLampClick, onLampHover }) {
  const stone = useTexture('./img/material-stone-800.webp');
  const K = useMemo(() => {
    stone.colorSpace = THREE.SRGBColorSpace;
    stone.wrapS = stone.wrapT = THREE.RepeatWrapping;
    // every surface material is registered with its group so Stage3D can fade it between line and solid
    const m = (g, mat) => {
      Object.assign(mat, { polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
      reg.groups[g].mats.add(mat);
      return mat;
    };
    const plasterN = noiseNormal({ size: 256, cells: 6, octaves: 4, strength: 1.2, seed: 3, repeat: 3 });
    const boucleN = noiseNormal({ size: 256, cells: 32, octaves: 2, strength: 3.5, seed: 11, repeat: 3 });
    const oak = oakTexture();
    oak.repeat.set(3.2, 2.5);
    const plaster = (g) => m(g, new THREE.MeshStandardMaterial({ color: '#EDE6DA', roughness: 0.95, normalMap: plasterN, normalScale: new THREE.Vector2(0.18, 0.18) }));
    const trav = (g) => m(g, new THREE.MeshStandardMaterial({ map: stone, roughness: 0.6 }));
    const brass = (g) => m(g, new THREE.MeshPhysicalMaterial({ color: '#C9A26B', metalness: 1, roughness: 0.35, anisotropy: 0.6, side: THREE.DoubleSide }));
    return {
      plasterShell: plaster('shell'),
      plasterWin: plaster('window'),
      plasterDecor: plaster('decor'),
      oak: m('shell', new THREE.MeshStandardMaterial({ map: oak, roughness: 0.7 })),
      frame: m('window', new THREE.MeshStandardMaterial({ color: '#3A3029', roughness: 0.55, metalness: 0.3 })),
      sky: m('window', new THREE.MeshBasicMaterial({ map: skyTexture() })),
      travTable: trav('table'),
      travDecor: trav('decor'),
      boucle: m('sofa', new THREE.MeshStandardMaterial({ color: '#F1ECE3', roughness: 1, normalMap: boucleN, normalScale: new THREE.Vector2(0.7, 0.7) })),
      brass: brass('lamp'),
      cord: m('lamp', new THREE.MeshStandardMaterial({ color: '#2B2420', roughness: 0.6 })),
      bulb: m('lamp', new THREE.MeshStandardMaterial({ color: '#FFF4E0', emissive: '#FFF4E0', emissiveIntensity: 0, roughness: 0.3 })),
      ceramic: m('decor', new THREE.MeshStandardMaterial({ color: '#E9E2D6', roughness: 0.55 })),
      pot: m('decor', new THREE.MeshStandardMaterial({ color: '#8C7A6B', roughness: 0.8 })),
      leaf: m('decor', new THREE.MeshStandardMaterial({ color: '#5B7045', roughness: 0.75, side: THREE.DoubleSide })),
    };
  }, [stone]);
  reg.bulbMat = K.bulb;
  reg.lampMats = [K.brass, K.cord, K.bulb];

  const G = useMemo(() => {
    const seg = (SOFA.len / SOFA.n) - 0.012;
    return {
      floor: new THREE.PlaneGeometry(W, D),
      ceil: new THREE.PlaneGeometry(W, D),
      side: new THREE.PlaneGeometry(D, H),
      back: wallWithWindow(),
      winRing: new THREE.ExtrudeGeometry(archRing(WIN.w - 0.1, WIN.sill + 0.05, WIN.spring, 0.07), { depth: 0.06, bevelEnabled: false, curveSegments: 40 }),
      mullV: new THREE.BoxGeometry(0.05, WIN.spring + WIN.w / 2 - WIN.sill - 0.1, 0.05),
      mullH: new THREE.BoxGeometry(WIN.w - 0.1, 0.05, 0.05),
      sky: new THREE.PlaneGeometry(6, 4.4),
      nichePanel: new THREE.ExtrudeGeometry(archShape(0.7, 0, 0.95), { depth: 0.02, bevelEnabled: false, curveSegments: 24 }),
      nicheRing: new THREE.ExtrudeGeometry(archRing(0.7, 0, 0.95, 0.06), { depth: 0.06, bevelEnabled: false, curveSegments: 24 }),
      shelf: new THREE.BoxGeometry(0.72, 0.03, 0.18),
      vase: lathe([[0, 0], [0.06, 0], [0.085, 0.06], [0.08, 0.14], [0.045, 0.2], [0.04, 0.24], [0.05, 0.26], [0, 0.26]], 24),
      base: new RoundedBoxGeometry(seg, 0.24, 0.95, 2, 0.06),
      seat: new RoundedBoxGeometry(seg - 0.01, 0.16, 0.76, 2, 0.07),
      back2: new RoundedBoxGeometry(seg - 0.01, 0.5, 0.22, 2, 0.09),
      arm: new RoundedBoxGeometry(0.16, 0.56, 0.95, 2, 0.07),
      baseE: new THREE.BoxGeometry(seg, 0.24, 0.95), seatE: new THREE.BoxGeometry(seg - 0.01, 0.16, 0.76),
      backE: new THREE.BoxGeometry(seg - 0.01, 0.5, 0.22), armE: new THREE.BoxGeometry(0.16, 0.56, 0.95),
      tableBody: new THREE.CylinderGeometry(0.6, 0.6, 0.33, 64),
      tableTop: new THREE.CylinderGeometry(0.645, 0.65, 0.05, 64),
      potG: new THREE.CylinderGeometry(0.21, 0.16, 0.42, 20),
      stem: new THREE.CylinderGeometry(0.008, 0.012, 1, 5),
      leafG: (() => { const l = new THREE.Shape(); l.moveTo(0, 0); l.quadraticCurveTo(0.5, 0.35, 0, 1); l.quadraticCurveTo(-0.5, 0.35, 0, 0); const g = new THREE.ShapeGeometry(l, 6); g.rotateX(-Math.PI / 2); return g; })(),
      shade: lathe(Array.from({ length: 13 }, (_, i) => {
        const t = (i / 12) * (Math.PI / 2);
        return [0.02 + LAMP.shadeR * Math.sin(t), -LAMP.shadeH * (1 - Math.cos(t))];
      }).concat([[LAMP.shadeR + 0.004, -LAMP.shadeH - 0.004]]), 40),
      canopy: new THREE.CylinderGeometry(0.06, 0.06, 0.03, 20),
      neck: new THREE.CylinderGeometry(0.025, 0.025, 0.06, 16),
      cordG: new THREE.CylinderGeometry(0.005, 0.005, 1, 6),
      bulbG: new THREE.SphereGeometry(0.045, 20, 14),
    };
  }, []);

  const sh = { reg };
  const sofaSegs = useMemo(() => Array.from({ length: SOFA.n }, (_, i) => {
    const arc = SOFA.len / SOFA.R, a = (i - (SOFA.n - 1) / 2) * (arc / SOFA.n);
    const cz = SOFA.z + SOFA.R;
    return { i, a, x: SOFA.R * Math.sin(a), z: cz - SOFA.R * Math.cos(a) };
  }), []);

  const plants = useMemo(() => {
    const r = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
    return [[-2.6, -3.9, 11], [2.55, -2.7, 29]].map(([x, z, seed]) => {
      const rnd = r(seed), n = small ? 7 : 14;
      const leaves = Array.from({ length: n }, (_, k) => {
        const ang = (k / n) * Math.PI * 2 + rnd() * 0.6, tilt = 0.35 + rnd() * 0.5, len = 0.55 + rnd() * 0.5;
        const tip = [Math.sin(ang) * Math.sin(tilt) * len, 0.42 + Math.cos(tilt) * len, Math.cos(ang) * Math.sin(tilt) * len];
        const dir = new THREE.Vector3(tip[0], tip[1] - 0.42, tip[2]);
        const stemLen = dir.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        return { ang, tilt, len, tip, stemLen, quat, mid: [tip[0] / 2, 0.42 + dir.y / 2, tip[2] / 2] };
      });
      return { x, z, leaves };
    });
  }, [small]);

  return (
    <group>
      {/* ---- shell ---- */}
      <Solid {...sh} g="shell" geo={G.floor} mat={K.oak} receive rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -D / 2]} />
      <Solid {...sh} g="shell" geo={G.ceil} mat={K.plasterShell} cast rotation={[Math.PI / 2, 0, 0]} position={[0, H, -D / 2]} />
      <Solid {...sh} g="shell" geo={G.side} mat={K.plasterShell} receive rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, -D / 2]} />
      <Solid {...sh} g="shell" geo={G.side} mat={K.plasterShell} receive rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, -D / 2]} />
      <Solid {...sh} g="shell" geo={G.back} mat={K.plasterShell} cast receive position={[0, 0, -D - 0.3]} />

      {/* ---- arched window, mullions, evening sky ---- */}
      <Solid {...sh} g="window" geo={G.winRing} mat={K.frame} position={[0, 0, -D - 0.2]} />
      <Solid {...sh} g="window" geo={G.mullV} mat={K.frame} position={[0, (WIN.sill + WIN.spring + WIN.w / 2) / 2, -D - 0.17]} />
      <Solid {...sh} g="window" geo={G.mullH} mat={K.frame} position={[0, 1.0, -D - 0.17]} />
      <Solid {...sh} g="window" geo={G.mullH} mat={K.frame} position={[0, 1.65, -D - 0.17]} />
      <mesh geometry={G.sky} material={K.sky} position={[0, 2.0, -D - 1.4]} />

      {/* ---- niches with vases ---- */}
      {[-2.2, 2.2].map((x) => (
        <group key={x} position={[x, 1.1, -D]}>
          <Solid {...sh} g="decor" geo={G.nichePanel} mat={K.travDecor} position={[0, 0, 0.005]} />
          <Solid {...sh} g="decor" geo={G.nicheRing} mat={K.plasterDecor} position={[0, 0, 0]} cast={!small} />
          <Solid {...sh} g="decor" geo={G.shelf} mat={K.travDecor} position={[0, 0.015, 0.1]} receive />
          <Solid {...sh} g="decor" geo={G.vase} mat={K.ceramic} position={[x < 0 ? 0.06 : -0.05, 0.03, 0.1]} scale={x < 0 ? 1 : 0.8} cast={!small} />
        </group>
      ))}

      {/* ---- curved bouclé sofa: seven segments on a 4 m arc ---- */}
      <group>
        {sofaSegs.map(({ i, a, x, z }) => (
          <group key={i} position={[x, 0, z]} rotation={[0, -a, 0]}>
            <Solid {...sh} g="sofa" geo={G.base} edgeGeo={G.baseE} mat={K.boucle} position={[0, 0.14, 0]} cast receive />
            <Solid {...sh} g="sofa" geo={G.seat} edgeGeo={G.seatE} mat={K.boucle} position={[0, 0.34, 0.08]} cast receive />
            <Solid {...sh} g="sofa" geo={G.back2} edgeGeo={G.backE} mat={K.boucle} position={[0, 0.6, -0.36]} rotation={[-0.12, 0, 0]} cast receive />
            {(i === 0 || i === SOFA.n - 1) && (
              <Solid {...sh} g="sofa" geo={G.arm} edgeGeo={G.armE} mat={K.boucle} position={[(i === 0 ? -1 : 1) * (SOFA.len / SOFA.n / 2 + 0.07), 0.3, 0]} cast receive />
            )}
          </group>
        ))}
      </group>

      {/* ---- travertine coffee table, Ø 1.3 m ---- */}
      <Solid {...sh} g="table" geo={G.tableBody} mat={K.travTable} position={[TABLE.x, 0.165, TABLE.z]} cast receive />
      <Solid {...sh} g="table" geo={G.tableTop} mat={K.travTable} position={[TABLE.x, TABLE.h - 0.025, TABLE.z]} cast receive />

      {/* ---- plants ---- */}
      {plants.map((pl) => (
        <group key={pl.x} position={[pl.x, 0, pl.z]}>
          <Solid {...sh} g="decor" geo={G.potG} mat={K.pot} position={[0, 0.21, 0]} cast={!small} receive />
          {pl.leaves.map((l, k) => (
            <group key={k}>
              <mesh geometry={G.stem} material={K.leaf} position={l.mid} quaternion={l.quat} scale={[1, l.stemLen, 1]} />
              <mesh geometry={G.leafG} material={K.leaf} position={l.tip} rotation={[l.tilt * 0.6 - 0.2, l.ang, 0]} scale={[0.26, 0.26, 0.42]} castShadow={!small} />
            </group>
          ))}
        </group>
      ))}

      {/* ---- LUMEN: cord, brushed-brass dome, bulb; pivots at the ceiling so it can swing ---- */}
      <group ref={(o) => { reg.lamp.group = o; }} position={[LAMP.x, H, LAMP.z]}>
        <Solid {...sh} g="lamp" geo={G.canopy} mat={K.brass} position={[0, -0.015, 0]} />
        <mesh geometry={G.cordG} material={K.cord} position={[0, -LAMP.cord / 2, 0]} scale={[1, LAMP.cord, 1]} />
        <Solid {...sh} g="lamp" geo={G.neck} mat={K.brass} position={[0, -LAMP.cord + 0.02, 0]} />
        <Solid {...sh} g="lamp" geo={G.shade} mat={K.brass} position={[0, -LAMP.cord, 0]} cast={!small}
          onClick={onLampClick} onPointerOver={() => onLampHover(true)} onPointerOut={() => onLampHover(false)} />
        <mesh geometry={G.bulbG} material={K.bulb} position={[0, -LAMP.cord - LAMP.shadeH + 0.03, 0]}
          onClick={onLampClick} onPointerOver={() => onLampHover(true)} onPointerOut={() => onLampHover(false)} />
        <object3D ref={(o) => { reg.lamp.target = o; }} position={[0, -H, 0]} />
        <object3D ref={(o) => { reg.lamp.centre = o; }} position={[0, -LAMP.cord - LAMP.shadeH / 2, 0]} />
        <spotLight ref={(o) => { reg.lamp.spot = o; }} position={[0, -LAMP.cord - LAMP.shadeH + 0.02, 0]} color="#FFD9A8" angle={0.95} penumbra={0.85} decay={2} distance={0}
          intensity={0} castShadow shadow-mapSize={small ? [512, 512] : [1024, 1024]} shadow-bias={-0.0004} shadow-normalBias={0.02} shadow-camera-near={0.1} shadow-camera-far={6} />
        <pointLight ref={(o) => { reg.lamp.point = o; }} position={[0, -LAMP.cord - LAMP.shadeH + 0.05, 0]} color="#FFC990" decay={2} distance={0} intensity={0} />
      </group>
    </group>
  );
}
