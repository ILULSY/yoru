// Détourage des photos sur fond blanc, partagé par le serveur (sharp) et le navigateur (canvas).

/**
 * Rend transparent le fond clair relié aux bords de l'image (remplissage par
 * diffusion) : le blanc à l'intérieur du produit est conservé. Les pixels de
 * bordure sont adoucis pour éviter un liseré.
 */
export function clearWhiteBackground(px: Uint8Array | Uint8ClampedArray, w: number, h: number) {
  const n = w * h;
  const isLight = (i: number) => {
    const o = i * 4;
    const r = px[o]!,
      g = px[o + 1]!,
      b = px[o + 2]!;
    const min = Math.min(r, g, b);
    return px[o + 3]! < 16 || (min >= 228 && Math.max(r, g, b) - min <= 22);
  };
  const bg = new Uint8Array(n);
  const stack: number[] = [];
  const push = (i: number) => {
    if (!bg[i] && isLight(i)) {
      bg[i] = 1;
      stack.push(i);
    }
  };
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }
  while (stack.length) {
    const i = stack.pop()!;
    const x = i % w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (i >= w) push(i - w);
    if (i < n - w) push(i + w);
  }
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    if (bg[i]) {
      px[o + 3] = 0;
      continue;
    }
    const x = i % w;
    const edge = (x > 0 && bg[i - 1]) || (x < w - 1 && bg[i + 1]) || (i >= w && bg[i - w]) || (i < n - w && bg[i + w]);
    if (edge) {
      const min = Math.min(px[o]!, px[o + 1]!, px[o + 2]!);
      if (min > 170) px[o + 3] = Math.round(px[o + 3]! * Math.min(1, (255 - min) / 85));
    }
  }
}
