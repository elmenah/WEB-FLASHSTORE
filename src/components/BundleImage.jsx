import React, { useEffect, useState } from 'react';

// Keep the original artwork; fit its visible pixels instead of its transparent canvas.
const boundsCache = new Map();
function measureArtwork(src) {
  if (boundsCache.has(src)) return boundsCache.get(src);
  const pending = new Promise(resolve => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onerror = () => resolve(null);
    image.onload = () => {
      try {
        const scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
        let left = canvas.width, top = canvas.height, right = -1, bottom = -1;
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            if (data[(y * canvas.width + x) * 4 + 3] > 8) {
              left = Math.min(left, x); right = Math.max(right, x);
              top = Math.min(top, y); bottom = Math.max(bottom, y);
            }
          }
        }
        if (right < left) return resolve(null);
        // A small margin retains antialiased edges and soft shadows.
        left = Math.max(0, left - 3); top = Math.max(0, top - 3);
        right = Math.min(canvas.width, right + 4); bottom = Math.min(canvas.height, bottom + 4);
        resolve({ width: image.naturalWidth, height: image.naturalHeight,
          viewBox: `${left / canvas.width * image.naturalWidth} ${top / canvas.height * image.naturalHeight} ${(right - left) / canvas.width * image.naturalWidth} ${(bottom - top) / canvas.height * image.naturalHeight}` });
      } catch { resolve(null); }
    };
    image.src = src;
  });
  if (boundsCache.size >= 80) boundsCache.delete(boundsCache.keys().next().value);
  boundsCache.set(src, pending);
  return pending;
}

export default function BundleImage({ src, fallbackSrc }) {
  const [artwork, setArtwork] = useState(null);
  useEffect(() => {
    let active = true;
    measureArtwork(src).then(bounds => { if (active) setArtwork({ src, bounds }); });
    return () => { active = false; };
  }, [src]);
  const bounds = artwork?.src === src ? artwork.bounds : null;
  if (bounds) return <svg className="flash-bundle-artwork" viewBox={bounds.viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <image href={src} width={bounds.width} height={bounds.height} />
  </svg>;
  return <img src={src} alt="" loading="lazy" onError={event => {
    if (fallbackSrc && event.currentTarget.getAttribute('src') !== fallbackSrc) event.currentTarget.src = fallbackSrc;
  }} />;
}
