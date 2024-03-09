"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// index.js
var require_zipkiss = __commonJS({
  "index.js"(exports2, module2) {
    "use strict";
    var I = Object.defineProperty;
    var Y = Object.getOwnPropertyDescriptor;
    var j = Object.getOwnPropertyNames;
    var q = Object.prototype.hasOwnProperty;
    var J = (f, o) => {
      for (var s in o)
        I(f, s, { get: o[s], enumerable: true });
    };
    var K = (f, o, s, r) => {
      if (o && typeof o == "object" || typeof o == "function")
        for (let a of j(o))
          !q.call(f, a) && a !== s && I(f, a, { get: () => o[a], enumerable: !(r = Y(o, a)) || r.enumerable });
      return f;
    };
    var Q = (f) => K(I({}, "__esModule", { value: true }), f);
    var B = {};
    J(B, { createZip: () => $ });
    module2.exports = Q(B);
    var v;
    var V = () => {
      let f = Int32Array, o = new f(256), s = new f(4096), r, a, l;
      for (a = 0; a < 256; a++)
        r = a, r = r & 1 ? -306674912 ^ r >>> 1 : r >>> 1, r = r & 1 ? -306674912 ^ r >>> 1 : r >>> 1, r = r & 1 ? -306674912 ^ r >>> 1 : r >>> 1, r = r & 1 ? -306674912 ^ r >>> 1 : r >>> 1, r = r & 1 ? -306674912 ^ r >>> 1 : r >>> 1, r = r & 1 ? -306674912 ^ r >>> 1 : r >>> 1, r = r & 1 ? -306674912 ^ r >>> 1 : r >>> 1, s[a] = o[a] = r & 1 ? -306674912 ^ r >>> 1 : r >>> 1;
      for (a = 0; a < 256; a++)
        for (l = o[a], r = 256 + a; r < 4096; r += 256)
          l = s[r] = l >>> 8 ^ o[l & 255];
      for (v = [o], a = 1; a < 16; a++)
        v[a] = s.subarray(a * 256, (a + 1) * 256);
    };
    var W = (f, o = 0) => {
      v || V();
      let [s, r, a, l, S, L, C, U, g, M, O, t, e, p, i, b] = v, c = o ^ -1, d = f.length - 15, n = 0;
      for (; n < d; )
        c = b[f[n++] ^ c & 255] ^ i[f[n++] ^ c >> 8 & 255] ^ p[f[n++] ^ c >> 16 & 255] ^ e[f[n++] ^ c >>> 24] ^ t[f[n++]] ^ O[f[n++]] ^ M[f[n++]] ^ g[f[n++]] ^ U[f[n++]] ^ C[f[n++]] ^ L[f[n++]] ^ S[f[n++]] ^ l[f[n++]] ^ a[f[n++]] ^ r[f[n++]] ^ s[f[n++]];
      for (d += 15; n < d; )
        c = c >>> 8 ^ s[(c ^ f[n++]) & 255];
      return ~c;
    };
    var X = typeof CompressionStream < "u";
    var Z = new TextEncoder();
    var G = (f) => f.reduce((o, s) => o + s.byteLength, 0);
    function _(f) {
      let o = new CompressionStream("gzip"), s = o.writable.getWriter(), r = o.readable.getReader();
      return s.write(f), s.close(), () => r.read();
    }
    async function $(f, o = true, s = _) {
      let r = [], a = X && o, l = f.length, S = f.map((i) => Z.encode(i.name)), L = f.map(({ data: i }) => typeof i == "string" ? Z.encode(i) : i instanceof ArrayBuffer ? new Uint8Array(i) : i), C = G(L), U = G(S), g = l * 46 + U, M = C + l * 30 + U + g + 22, O = /* @__PURE__ */ new Date(), t = new Uint8Array(M), e = 0;
      for (let i = 0; i < l; i++) {
        r[i] = e;
        let b = S[i], c = b.byteLength, d = L[i], n = d.byteLength, T = f[i].lastModified ?? O, F = Math.floor(T.getSeconds() / 2) + (T.getMinutes() << 5) + (T.getHours() << 11), H = T.getDate() + (T.getMonth() + 1 << 5) + (T.getFullYear() - 1980 << 9), h = 0, z = false;
        t[e++] = 80, t[e++] = 75, t[e++] = 3, t[e++] = 4, t[e] = 20, e += 3, t[e++] = 8;
        let P = e;
        e += 2, t[e++] = F & 255, t[e++] = F >> 8, t[e++] = H & 255, t[e++] = H >> 8;
        let x = e;
        if (e += 8, t[e++] = n & 255, t[e++] = n >> 8 & 255, t[e++] = n >> 16 & 255, t[e++] = n >> 24, t[e++] = c & 255, t[e] = c >> 8 & 255, e += 3, t.set(b, e), e += c, a) {
          let m = e, E = s(d), y, A = 0, k = 0;
          e: {
            for (; ; ) {
              let u = await E();
              if (u.done)
                throw new Error("Bad gzip data");
              if (y = u.value, A = k, k = A + y.length, A <= 3 && k > 3 && y[3 - A] & 30) {
                z = true;
                break e;
              }
              if (k >= 10) {
                y = y.subarray(10 - A);
                break;
              }
            }
            for (; ; ) {
              let u = e - m, w = y.byteLength;
              if (u + w >= n) {
                z = true;
                break e;
              }
              t.set(y, e), e += w;
              let N = await E();
              if (N.done)
                break;
              y = N.value;
            }
          }
          if (z)
            for (; ; ) {
              let u = y.byteLength, w = 8 - u, N = e;
              e = m;
              for (let D = 0; D < 8; D++)
                t[e++] = D < w ? t[N - w + D] : y[u - 8 + D];
              let R = await E();
              if (R.done)
                break;
              y = R.value;
            }
          e -= 8, t[x++] = t[e++], t[x++] = t[e++], t[x++] = t[e++], t[x++] = t[e++], e -= 4, z || (t[P] = 8, h = e - m);
        }
        if ((!a || z) && (t.set(d, e), e += n, h = n), !a) {
          let m = W(d);
          t[x++] = m & 255, t[x++] = m >> 8 & 255, t[x++] = m >> 16 & 255, t[x++] = m >> 24;
        }
        t[x++] = h & 255, t[x++] = h >> 8 & 255, t[x++] = h >> 16 & 255, t[x++] = h >> 24;
      }
      let p = e;
      for (let i = 0; i < l; i++) {
        let b = r[i], c = S[i], d = c.byteLength;
        t[e++] = 80, t[e++] = 75, t[e++] = 1, t[e++] = 2, t[e] = 20, e += 2, t[e] = 20, e += 2, t.set(t.subarray(b + 6, b + 30), e), e += 34, t[e++] = b & 255, t[e++] = b >> 8 & 255, t[e++] = b >> 16 & 255, t[e++] = b >> 24, t.set(c, e), e += d;
      }
      return t[e++] = 80, t[e++] = 75, t[e++] = 5, t[e] = 6, e += 5, t[e++] = l & 255, t[e++] = l >> 8 & 255, t[e++] = l & 255, t[e++] = l >> 8 & 255, t[e++] = g & 255, t[e++] = g >> 8 & 255, t[e++] = g >> 16 & 255, t[e++] = g >> 24, t[e++] = p & 255, t[e++] = p >> 8 & 255, t[e++] = p >> 16 & 255, t[e] = p >> 24, t.subarray(0, e + 3);
    }
  }
});

// test.ts
var import__ = __toESM(require_zipkiss());
var import_fs = require("fs");
var import_child_process = require("child_process");
var import_crypto = require("crypto");
var testStr = "The quick brown fox jumps over the lazy dog.\n";
function makeTestZip(compress, makeReadFn) {
  const rawFiles = [];
  let i = 0;
  do {
    i++;
    const maxDataLength = [16, 1024, 65536][Math.floor(Math.random() * 3)];
    const dataLength = Math.floor(Math.random() * maxDataLength);
    let data;
    if (Math.random() < 0.5) {
      data = testStr.repeat(Math.ceil(dataLength / testStr.length)).slice(0, dataLength);
    } else {
      data = new Uint8Array(dataLength);
      import_crypto.webcrypto.getRandomValues(data);
    }
    rawFiles.push({
      name: `f_${i}.${typeof data === "string" ? "txt" : "bin"}`,
      data
    });
  } while (Math.random() < 0.667);
  return (0, import__.createZip)(rawFiles, compress, makeReadFn);
}
function byteByByteReadFn(dataIn) {
  const cs = new CompressionStream("gzip"), writer = cs.writable.getWriter(), reader = cs.readable.getReader();
  writer.write(dataIn);
  writer.close();
  let buffer, bufferIndex;
  return async () => {
    if (buffer !== void 0 && bufferIndex < buffer.byteLength) {
      return { value: buffer.subarray(bufferIndex, ++bufferIndex), done: false };
    }
    const { value, done } = await reader.read();
    if (done) {
      return { value, done };
    } else {
      buffer = value;
      bufferIndex = 0;
      return { value: buffer.subarray(bufferIndex, ++bufferIndex), done: false };
    }
  };
}
function singleChunkReadFn(dataIn) {
  const cs = new CompressionStream("gzip"), writer = cs.writable.getWriter(), reader = cs.readable.getReader();
  writer.write(dataIn);
  writer.close();
  let buffer = new Uint8Array(), returned = false;
  return async () => {
    if (returned) {
      return { value: void 0, done: true };
    }
    for (; ; ) {
      const { value, done } = await reader.read();
      if (done) {
        returned = true;
        return { value: buffer, done: false };
      }
      const newBuffer = new Uint8Array(buffer.byteLength + value.byteLength);
      newBuffer.set(buffer);
      newBuffer.set(value, buffer.byteLength);
      buffer = newBuffer;
    }
  };
}
async function test() {
  for (const compress of [true, false]) {
    console.log("compress:", compress);
    for (const makeReadFn of [void 0, byteByByteReadFn, singleChunkReadFn]) {
      console.log("  read function:", makeReadFn?.name);
      for (let i = 0; i < 1e3; i++) {
        const zip = await makeTestZip(compress, makeReadFn);
        const file = `testfiles/z_${i}.zip`;
        (0, import_fs.writeFileSync)(file, zip);
        (0, import_child_process.execFileSync)("/usr/bin/unzip", ["-t", file]);
      }
    }
  }
}
test();
