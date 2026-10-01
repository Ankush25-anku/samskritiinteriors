import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import manifest from '../img-placeholders.json';

const BASE = './img/';

/** Resolved URLs for a slot, for places that need a plain URL (CSS backgrounds). */
export const imgUrl = (slot, w = 1600) => {
  const m = manifest[slot];
  const best = m ? m.widths.filter((x) => x <= w).pop() || m.widths[0] : w;
  return `${BASE}${slot}-${best}.jpg`;
};

/**
 * Responsive photo: AVIF → WebP → JPG, 800/1600/2400 srcset, intrinsic width/height (no layout shift),
 * lazy by default, and a 24px blurred placeholder that sharpens away once the real image has loaded.
 * <picture> is display:contents, so section CSS keeps targeting the <img> as before.
 */
const Img = forwardRef(function Img({ slot, alt = '', sizes = '100vw', eager = false, className = '', style, as: Tag = 'img', fade = true, ...rest }, ref) {
  const m = manifest[slot];
  const el = useRef(null);
  const [loaded, setLoaded] = useState(false);
  useImperativeHandle(ref, () => el.current);
  useEffect(() => { if (el.current?.complete && el.current.naturalWidth) setLoaded(true); }, [slot]);
  if (!m) return null;
  const set = (ext) => m.widths.map((w) => `${BASE}${slot}-${w}.${ext} ${w}w`).join(', ');
  const ph = loaded ? undefined : { backgroundImage: `url(${m.ph})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  return (
    <picture className="pic">
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <Tag
        ref={el}
        src={`${BASE}${slot}-${m.widths[Math.min(1, m.widths.length - 1)]}.jpg`}
        srcSet={set('jpg')}
        sizes={sizes}
        width={m.w}
        height={m.h}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={className + (fade && loaded ? ' img-in' : '')}
        style={{ ...ph, ...style }}
        onLoad={() => setLoaded(true)}
        {...rest}
      />
    </picture>
  );
});

export default Img;
