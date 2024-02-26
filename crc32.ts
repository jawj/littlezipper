/*
This implementation is adapted from https://github.com/SheetJS/js-crc32.

Copyright (C) 2014-present SheetJS LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

let T: Int32Array[];

const init = () => {
  const
    i32 = Int32Array,
    T0 = new i32(256),
    t = new i32(4096);
  let c: number, n: number, v: number;
  for (n = 0; n < 256; n++) {
    c = n;
    c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));  // nice bit of loop-unrolling
    c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
    c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
    c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
    c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
    c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
    c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
    t[n] = T0[n] = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
  }
  for (n = 0; n < 256; n++) {
    v = T0[n];
    for (c = 256 + n; c < 4096; c += 256) v = t[c] = (v >>> 8) ^ T0[v & 255];
  }
  T = [T0];
  for (n = 1; n < 16; n++) T[n] = t.subarray(n * 256, (n + 1) * 256);  // slice lookups are not faster
}

export const crc32 = (B: Uint8Array, seed = 0) => {
  if (!T) init();
  const [T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, Ta, Tb, Tc, Td, Te, Tf] = T;
  let
    crc = seed ^ -1,
    l = B.length - 15,
    i = 0;
  for (; i < l;) crc =
    Tf[B[i++] ^ (crc & 255)] ^
    Te[B[i++] ^ ((crc >> 8) & 255)] ^
    Td[B[i++] ^ ((crc >> 16) & 255)] ^
    Tc[B[i++] ^ (crc >>> 24)] ^
    Tb[B[i++]] ^ Ta[B[i++]] ^ T9[B[i++]] ^ T8[B[i++]] ^
    T7[B[i++]] ^ T6[B[i++]] ^ T5[B[i++]] ^ T4[B[i++]] ^
    T3[B[i++]] ^ T2[B[i++]] ^ T1[B[i++]] ^ T0[B[i++]];
  l += 15;
  while (i < l) crc = (crc >>> 8) ^ T0[(crc ^ B[i++]) & 255];
  return ~crc;
}
