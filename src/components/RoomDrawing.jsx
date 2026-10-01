import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------
   The hero room as a hand-authored line drawing (not traced): ~30 clean paths that line up with the
   hero photograph (public/img/hero-*, a 16:10 crop, mirrored). Coordinates are in the photo's own
   1600×1000 space as shot; the group mirrors them to match the published (flopped) photo.
   Lumen is not drawn here: the lamp is its own travelling element.
   ------------------------------------------------------------ */
export const ROOM_PATHS = [
  // the room
  'M912 0 V572',                                                        // corner where the back wall meets the window wall
  'M0 40 H246 V413 H0',                                                 // framed art, left (runs off the edge)
  'M308 67 H519 V413 H308 Z',                                           // framed art, right
  'M945 30 L1600 12',                                                   // curtain rod
  'M976 34 C986 200 972 380 984 560',                                   // sheer, left panel
  'M1084 34 C1080 200 1090 380 1084 545',
  'M1090 70 H1310 M1090 70 V545 M1090 205 H1310 M1198 70 V545',          // window, left lights
  'M1312 26 C1320 240 1304 430 1320 600',                               // sheer, right panel
  'M1462 18 C1466 220 1456 420 1468 580',
  'M1466 160 H1600',                                                    // window, right light
  // sofa, left (long, low)
  'M120 548 Q124 528 160 527 L682 527 Q706 529 708 552 L708 588',      // back
  'M640 590 L706 584 Q744 588 747 616 L744 766',                        // right arm
  'M22 880 V692 Q24 662 60 657 L116 652 V880',                          // left arm
  'M116 765 Q250 769 392 768',                                          // seat edge (the rest is behind the table)
  'M22 880 H392',                                                       // base
  'M507 548 L664 545 L668 628 L510 631 Z',                              // cushion
  // sofa, right (tufted, on legs)
  'M892 588 Q896 568 930 566 L1380 548 Q1530 514 1568 554 Q1590 590 1586 640 L1583 818',
  'M892 588 Q884 612 890 642 L905 736',                                 // left arm
  'M905 690 Q1150 676 1402 690',                                        // seat edge
  'M905 736 L1396 795 L1583 818',                                       // base
  'M1402 796 L1412 890 M1552 818 L1556 846',                            // legs
  'M1032 530 L1214 526 L1224 650 L1042 640 Z',                          // cushion
  // the coffee table: a block of wood
  'M985 757 L450 720 L395 810 L615 848 Z',                              // top
  'M985 757 L985 905 L615 960 L615 848',                                // long face
  'M395 810 L400 928 L615 960',                                         // short face
  'M699 705 Q712 745 765 748 Q818 745 831 705 Q765 690 699 705 Z',      // bowl
  'M628 607 Q614 652 622 716 L660 716 Q668 652 655 607 Z',              // vase
  // pouf
  'M1106 800 A107 28 0 0 1 1320 800 A107 28 0 0 1 1106 800 Z',
  'M1106 800 V900 Q1213 938 1320 900 V800',
  // olive tree in its pot
  'M797 628 H880 L878 728 H800 Z',
  'M860 628 C858 520 864 420 872 262',
  'M866 420 C826 380 786 330 742 214 M870 332 C900 282 950 232 1000 190 M862 470 C830 450 792 430 736 345',
];

/** The drawing; `progress` (0–1, a motion value or number) plots it on with stroke-dashoffset. */
export default function RoomDrawing({ progress = 1, portrait = false, className = '' }) {
  const ref = useRef(null);
  // a uniform 1.25px line on screen at any size (the SVG is scaled with 'slice', so the stroke is set in its own units)
  useEffect(() => {
    const el = ref.current;
    const fit = () => {
      const r = el.getBoundingClientRect(), vb = el.viewBox.baseVal;
      if (!r.width || !vb.width) return;
      el.style.setProperty('--sw', (1.25 / Math.max(r.width / vb.width, r.height / vb.height)).toFixed(3));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [portrait]);
  // portrait: the same 9:16 window onto the room as the phone crop of the photo (centred on the table, x = 910)
  const vb = portrait ? '628.75 0 562.5 1000' : '0 0 1600 1000';
  const n = ROOM_PATHS.length;
  return (
    <motion.svg ref={ref} className={'room-drawing ' + className} viewBox={vb} preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      style={{ '--d': progress }}>
      <g transform="matrix(-1 0 0 1 1600 0)">
        {ROOM_PATHS.map((d, i) => <path key={i} d={d} pathLength="1" style={{ '--k': (i / n).toFixed(3) }} />)}
      </g>
    </motion.svg>
  );
}
