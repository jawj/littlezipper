"use strict";

// crc32.ts
var T;
var init = () => {
  const i32 = Int32Array, T0 = new i32(256), t = new i32(4096);
  let c, n, v;
  for (n = 0; n < 256; n++) {
    c = n;
    c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
    c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
    c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
    c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
    c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
    c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
    c = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
    t[n] = T0[n] = c & 1 ? -306674912 ^ c >>> 1 : c >>> 1;
  }
  for (n = 0; n < 256; n++) {
    v = T0[n];
    for (c = 256 + n; c < 4096; c += 256)
      v = t[c] = v >>> 8 ^ T0[v & 255];
  }
  T = [T0];
  for (n = 1; n < 16; n++)
    T[n] = t.subarray(n * 256, (n + 1) * 256);
};
var crc32 = (B, seed = 0) => {
  if (!T)
    init();
  const [T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, Ta, Tb, Tc, Td, Te, Tf] = T;
  let crc = seed ^ -1, l = B.length - 15, i = 0;
  for (; i < l; )
    crc = Tf[B[i++] ^ crc & 255] ^ Te[B[i++] ^ crc >> 8 & 255] ^ Td[B[i++] ^ crc >> 16 & 255] ^ Tc[B[i++] ^ crc >>> 24] ^ Tb[B[i++]] ^ Ta[B[i++]] ^ T9[B[i++]] ^ T8[B[i++]] ^ T7[B[i++]] ^ T6[B[i++]] ^ T5[B[i++]] ^ T4[B[i++]] ^ T3[B[i++]] ^ T2[B[i++]] ^ T1[B[i++]] ^ T0[B[i++]];
  l += 15;
  while (i < l)
    crc = crc >>> 8 ^ T0[(crc ^ B[i++]) & 255];
  return ~crc;
};

// index.ts
var hasCompressionStreams = typeof CompressionStream !== "undefined";
var textEncoder = new TextEncoder();
var lengthSum = (ns) => ns.reduce((memo, n) => memo + n.length, 0);
function makeGzipReadFn(dataIn) {
  const cs = new CompressionStream("gzip"), writer = cs.writable.getWriter(), reader = cs.readable.getReader();
  writer.write(dataIn);
  writer.close();
  return () => reader.read();
}
async function createZip(inputFiles, compressWhenPossible = true, gzipReadFn = makeGzipReadFn) {
  const localHeaderOffsets = [], attemptDeflate = hasCompressionStreams && compressWhenPossible, numFiles = inputFiles.length, filePaths = inputFiles.map((file) => textEncoder.encode(file.path)), fileData = inputFiles.map(({ data }) => typeof data === "string" ? textEncoder.encode(data) : data instanceof ArrayBuffer ? new Uint8Array(data) : data), totalDataSize = lengthSum(fileData), totalFilePathsSize = lengthSum(filePaths), centralDirectorySize = numFiles * 46 + totalFilePathsSize, maxZipSize = totalDataSize + numFiles * 30 + totalFilePathsSize + centralDirectorySize + 22, now = /* @__PURE__ */ new Date(), zip = new Uint8Array(maxZipSize);
  let b = 0;
  for (let fileIndex = 0; fileIndex < numFiles; fileIndex++) {
    localHeaderOffsets[fileIndex] = b;
    const fileName = filePaths[fileIndex], fileNameSize = fileName.length, uncompressed = fileData[fileIndex], uncompressedSize = uncompressed.length, lm = inputFiles[fileIndex].lastModified ?? now, mtime = Math.floor(lm.getSeconds() / 2) + (lm.getMinutes() << 5) + (lm.getHours() << 11), mdate = lm.getDate() + (lm.getMonth() + 1 << 5) + (lm.getFullYear() - 1980 << 9);
    let compressedSize = 0, abortDeflate = false;
    zip[b++] = 80;
    zip[b++] = 75;
    zip[b++] = 3;
    zip[b++] = 4;
    zip[b++] = 20;
    zip[b++] = 0;
    zip[b++] = 0;
    zip[b++] = 8;
    const bDeflate = b;
    zip[b++] = 0;
    zip[b++] = 0;
    zip[b++] = mtime & 255;
    zip[b++] = mtime >> 8;
    zip[b++] = mdate & 255;
    zip[b++] = mdate >> 8;
    let bCrc = b;
    b += 8;
    zip[b++] = uncompressedSize & 255;
    zip[b++] = uncompressedSize >> 8 & 255;
    zip[b++] = uncompressedSize >> 16 & 255;
    zip[b++] = uncompressedSize >> 24;
    zip[b++] = fileNameSize & 255;
    zip[b++] = fileNameSize >> 8 & 255;
    zip[b++] = 0;
    zip[b++] = 0;
    zip.set(fileName, b);
    b += fileNameSize;
    if (attemptDeflate) {
      const compressedStart = b, read = gzipReadFn(uncompressed);
      let bytes, bytesStartOffset = 0, bytesEndOffset = 0;
      deflate: {
        for (; ; ) {
          const data = await read();
          if (data.done)
            throw new Error("Bad gzip data");
          bytes = data.value;
          bytesStartOffset = bytesEndOffset;
          bytesEndOffset = bytesStartOffset + bytes.length;
          if (bytesStartOffset <= 3 && bytesEndOffset > 3) {
            const flags = bytes[3 - bytesStartOffset];
            if (flags & 30) {
              abortDeflate = true;
              break deflate;
            }
          }
          if (bytesEndOffset >= 10) {
            bytes = bytes.subarray(10 - bytesStartOffset);
            break;
          }
        }
        for (; ; ) {
          const bytesAlreadyWritten = b - compressedStart, bytesLength = bytes.length;
          if (bytesAlreadyWritten + bytesLength >= uncompressedSize + 8) {
            abortDeflate = true;
            break deflate;
          }
          zip.set(bytes, b);
          b += bytesLength;
          const data = await read();
          if (data.done)
            break;
          bytes = data.value;
        }
      }
      if (abortDeflate) {
        for (; ; ) {
          const bytesLength = bytes.length, copyBytes = 8 - bytesLength, bPrev = b;
          b = compressedStart;
          for (let i = 0; i < 8; i++) {
            zip[b++] = i < copyBytes ? zip[bPrev - copyBytes + i] : bytes[bytesLength - 8 + i];
          }
          const data = await read();
          if (data.done)
            break;
          bytes = data.value;
        }
      }
      b -= 8;
      zip[bCrc++] = zip[b++];
      zip[bCrc++] = zip[b++];
      zip[bCrc++] = zip[b++];
      zip[bCrc++] = zip[b++];
      b -= 4;
      if (!abortDeflate) {
        zip[bDeflate] = 8;
        compressedSize = b - compressedStart;
      }
    }
    if (!attemptDeflate || abortDeflate) {
      zip.set(uncompressed, b);
      b += uncompressedSize;
      compressedSize = uncompressedSize;
    }
    if (!attemptDeflate) {
      const crc = crc32(uncompressed);
      zip[bCrc++] = crc & 255;
      zip[bCrc++] = crc >> 8 & 255;
      zip[bCrc++] = crc >> 16 & 255;
      zip[bCrc++] = crc >> 24;
    }
    zip[bCrc++] = compressedSize & 255;
    zip[bCrc++] = compressedSize >> 8 & 255;
    zip[bCrc++] = compressedSize >> 16 & 255;
    zip[bCrc++] = compressedSize >> 24;
  }
  const centralDirectoryOffset = b;
  for (let fileIndex = 0; fileIndex < numFiles; fileIndex++) {
    const localHeaderOffset = localHeaderOffsets[fileIndex], fileName = filePaths[fileIndex], fileNameSize = fileName.length;
    zip[b++] = 80;
    zip[b++] = 75;
    zip[b++] = 1;
    zip[b++] = 2;
    zip[b++] = 20;
    zip[b++] = 0;
    zip[b++] = 20;
    zip[b++] = 0;
    zip.set(zip.subarray(localHeaderOffset + 6, localHeaderOffset + 30), b);
    b += 24;
    zip[b++] = zip[b++] = zip[b++] = zip[b++] = zip[b++] = zip[b++] = zip[b++] = zip[b++] = zip[b++] = zip[b++] = 0;
    zip[b++] = localHeaderOffset & 255;
    zip[b++] = localHeaderOffset >> 8 & 255;
    zip[b++] = localHeaderOffset >> 16 & 255;
    zip[b++] = localHeaderOffset >> 24;
    zip.set(fileName, b);
    b += fileNameSize;
  }
  zip[b++] = 80;
  zip[b++] = 75;
  zip[b++] = 5;
  zip[b++] = 6;
  zip[b++] = zip[b++] = zip[b++] = zip[b++] = 0;
  zip[b++] = numFiles & 255;
  zip[b++] = numFiles >> 8 & 255;
  zip[b++] = numFiles & 255;
  zip[b++] = numFiles >> 8 & 255;
  zip[b++] = centralDirectorySize & 255;
  zip[b++] = centralDirectorySize >> 8 & 255;
  zip[b++] = centralDirectorySize >> 16 & 255;
  zip[b++] = centralDirectorySize >> 24;
  zip[b++] = centralDirectoryOffset & 255;
  zip[b++] = centralDirectoryOffset >> 8 & 255;
  zip[b++] = centralDirectoryOffset >> 16 & 255;
  zip[b++] = centralDirectoryOffset >> 24;
  zip[b++] = zip[b++] = 0;
  return zip.subarray(0, b);
}

// test.ts
var import_fs = require("fs");
var import_child_process = require("child_process");
var import_crypto = require("crypto");
var testStr = "The quick brown fox jumps over the lazy dog.\n";
function makeTestData() {
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
      path: `f_${i}.${typeof data === "string" ? "txt" : "dat"}`,
      // .dat and not .bin, because Macs try to extract .bin files!
      data
    });
  } while (Math.random() < 0.667);
  return rawFiles;
}
function makeTestZip(compress, makeReadFn) {
  return createZip(makeTestData(), compress, makeReadFn);
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
  for (const compress of [false, true]) {
    console.log("compress:", compress);
    for (const makeReadFn of [byteByByteReadFn, singleChunkReadFn, void 0]) {
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
