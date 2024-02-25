let T: Int32Array[];

const init = () => {
  const T0 = new Int32Array(256), t = new Int32Array(4096), x = -306674912;
  let c: number, n: number, v: number;
  for (n = 0; n < 256; n++) {
    c = n;
    c = ((c & 1) ? (x ^ (c >>> 1)) : (c >>> 1));
    c = ((c & 1) ? (x ^ (c >>> 1)) : (c >>> 1));
    c = ((c & 1) ? (x ^ (c >>> 1)) : (c >>> 1));
    c = ((c & 1) ? (x ^ (c >>> 1)) : (c >>> 1));
    c = ((c & 1) ? (x ^ (c >>> 1)) : (c >>> 1));
    c = ((c & 1) ? (x ^ (c >>> 1)) : (c >>> 1));
    c = ((c & 1) ? (x ^ (c >>> 1)) : (c >>> 1));
    c = ((c & 1) ? (x ^ (c >>> 1)) : (c >>> 1));
    T0[n] = c;
  }
  for (n = 0; n < 256; n++) t[n] = T0[n];
  for (n = 0; n < 256; n++) {
    v = T0[n];
    for (c = 256 + n; c < 4096; c += 256) v = t[c] = (v >>> 8) ^ T0[v & 255];
  }
  T = [T0];
  for (n = 1; n < 16; n++) T[n] = t.subarray(n * 256, n * 256 + 256);
}

export const crc32 = (B: Uint8Array, seed = 0) => {
  if (!T) init();
  const [T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, Ta, Tb, Tc, Td, Te, Tf] = T;
  let C = seed ^ -1, L = B.length - 15, i = 0;
  for (; i < L;) {
    C =
      Tf[B[i++] ^ (C & 255)] ^
      Te[B[i++] ^ ((C >> 8) & 255)] ^
      Td[B[i++] ^ ((C >> 16) & 255)] ^
      Tc[B[i++] ^ (C >>> 24)] ^
      Tb[B[i++]] ^ Ta[B[i++]] ^ T9[B[i++]] ^ T8[B[i++]] ^
      T7[B[i++]] ^ T6[B[i++]] ^ T5[B[i++]] ^ T4[B[i++]] ^
      T3[B[i++]] ^ T2[B[i++]] ^ T1[B[i++]] ^ T0[B[i++]];
  }
  L += 15;
  while (i < L) C = (C >>> 8) ^ T0[(C ^ B[i++]) & 255];
  return ~C;
}
