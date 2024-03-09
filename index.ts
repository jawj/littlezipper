/**
 * littlezip
 * Copyright (C) George MacKerron 2024
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// references:
// https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip.html
// https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT
// https://www.rfc-editor.org/rfc/rfc1952

import { crc32 } from './crc32';

export interface File {
  path: string;
  data: string | ArrayBuffer | Uint8Array;
  lastModified?: Date;
}

const
  hasCompressionStreams = typeof CompressionStream !== 'undefined',
  textEncoder = new TextEncoder(),
  byteLengthSum = (ns: Uint8Array[]) => ns.reduce((memo, n) => memo + n.byteLength, 0);

function makeGzipReadFn(dataIn: Uint8Array) {
  const 
    cs = new CompressionStream('gzip'),
    writer = cs.writable.getWriter(),
    reader = cs.readable.getReader();

  writer.write(dataIn);
  writer.close();
  return () => reader.read();
}

export async function createZip(inputFiles: File[], compressWhenPossible = true, gzipReadFn = makeGzipReadFn) {
  const
    localHeaderOffsets = [],
    attemptDeflate = hasCompressionStreams && compressWhenPossible,
    numFiles = inputFiles.length,
    filePaths = inputFiles.map(file => textEncoder.encode(file.path)),
    fileData = inputFiles.map(({ data }) =>
      typeof data === 'string' ? textEncoder.encode(data) :
        data instanceof ArrayBuffer ? new Uint8Array(data) : data),
    totalDataSize = byteLengthSum(fileData),
    totalFilePathsSize = byteLengthSum(filePaths),
    centralDirectorySize = numFiles * 46 + totalFilePathsSize,
    // if deflate expands the data, which can happen, we just stick it in uncompressed, so the uncompressed size is worst case
    maxZipSize = totalDataSize
      + numFiles * 30 + totalFilePathsSize  // local headers
      + centralDirectorySize + 22,  // 22 = cental directory trailer
    now = new Date(),
    zip = new Uint8Array(maxZipSize);

  let b = 0;  // zip byte index

  // write local headers and compressed files
  for (let fileIndex = 0; fileIndex < numFiles; fileIndex++) {
    localHeaderOffsets[fileIndex] = b;
    
    const
      fileName = filePaths[fileIndex],
      fileNameSize = fileName.byteLength,
      uncompressed = fileData[fileIndex],
      uncompressedSize = uncompressed.byteLength,
      lm = inputFiles[fileIndex].lastModified ?? now,
      mtime = Math.floor(lm.getSeconds() / 2) + (lm.getMinutes() << 5) + (lm.getHours() << 11),
      mdate = lm.getDate() + ((lm.getMonth() + 1) << 5) + ((lm.getFullYear() - 1980) << 9);

    let 
      compressedSize = 0,
      abortDeflate = false;

    // signature
    zip[b++] = 0x50; // P
    zip[b++] = 0x4b; // K
    zip[b++] = 0x03;
    zip[b++] = 0x04;
    // version needed to extract
    zip[b] = 20;  // 2.0
    // 0
    // general purpose flag
    // 0
    b += 3;
    zip[b++] = 0b1000;  // bit 11 (indexed from 0) => UTF-8 file names
    // compression
    const bDeflate8 = b;
    // 0 -- we'll modify this compression flag later if we deflate the file
    // 0
    b += 2;
    // mtime, mdate
    zip[b++] = mtime & 0xff;
    zip[b++] = mtime >> 8;
    zip[b++] = mdate & 0xff;
    zip[b++] = mdate >> 8;
    // CRC (4 bytes) then compressed size (4 bytes) -- we'll write these later 
    let bCrcCompSize = b;
    b += 8;
    // uncompressed size
    zip[b++] = uncompressedSize & 0xff;
    zip[b++] = (uncompressedSize >> 8) & 0xff;
    zip[b++] = (uncompressedSize >> 16) & 0xff;
    zip[b++] = (uncompressedSize >> 24);
    // file name length
    zip[b++] = fileNameSize & 0xff;
    zip[b] = (fileNameSize >> 8) & 0xff;
    // extra field length
    // 0
    // 0
    b += 3;
    // file name
    zip.set(fileName, b);
    b += fileNameSize;

    // compressed data
    if (attemptDeflate) {
      const
        compressedStart = b,
        read = gzipReadFn(uncompressed);

      let
        bytes: Uint8Array,
        bytesStartOffset = 0,
        bytesEndOffset = 0;

      deflate: {
        // check and skip gzip header
        for (; ;) {
          const data = await read();
          if (data.done) throw new Error('Bad gzip data');

          bytes = data.value;
          bytesStartOffset = bytesEndOffset;
          bytesEndOffset = bytesStartOffset + bytes.length;

          // check flags value
          // note: we assume no optional fields; if there are any, we give up on compression
          if (bytesStartOffset <= 3 && bytesEndOffset > 3) {
            const flags = bytes[3 - bytesStartOffset];
            if (flags & 0b11110) {
              abortDeflate = true;  // assumptions on gzip flags were violated
              break deflate;
            }
          }

          // check end of header
          if (bytesEndOffset >= 10 /* gzip header bytes */) {
            bytes = bytes.subarray(10 - bytesStartOffset);  // length could be zero
            break;
          }
        }

        // copy compressed data
        for (; ;) {
          const
            bytesAlreadyWritten = b - compressedStart,
            bytesLength = bytes.byteLength;

          if (bytesAlreadyWritten + bytesLength >= uncompressedSize) {
            abortDeflate = true;
            break deflate;
          }

          zip.set(bytes, b);
          b += bytesLength;

          const data = await read();
          if (data.done) break;

          bytes = data.value;
        }
      }

      if (abortDeflate) {
        // Either we got unexpected flags, or deflate made the data larger.
        // In either case, we give up on the compressed data, but hold on for the CRC.
        // We need the last 8 bytes of gzip data: the first 4 of these are the CRC.

        for (; ;) {
          const
            bytesLength = bytes.byteLength,
            copyBytes = 8 - bytesLength,
            bPrev = b;

          b = compressedStart;
          for (let i = 0; i < 8; i++) {
            zip[b++] = i < copyBytes ? zip[bPrev - copyBytes + i] : bytes[bytesLength - 8 + i];
          }

          const data = await read();
          if (data.done) break;

          bytes = data.value;
        }
      }

      // backtrack and retrieve CRC
      b -= 8;
      zip[bCrcCompSize++] = zip[b++];
      zip[bCrcCompSize++] = zip[b++];
      zip[bCrcCompSize++] = zip[b++];
      zip[bCrcCompSize++] = zip[b++];
      b -= 4;

      if (!abortDeflate) {
        zip[bDeflate8] = 8;  // deflate
        compressedSize = b - compressedStart;
      }
    }
    
    if (!attemptDeflate || abortDeflate) {
      zip.set(uncompressed, b);
      b += uncompressedSize;
      compressedSize = uncompressedSize;
    }

    if (!attemptDeflate) {
      // calculate CRC ourselves
      const crc = crc32(uncompressed);
      zip[bCrcCompSize++] = crc & 0xff;
      zip[bCrcCompSize++] = (crc >> 8) & 0xff;
      zip[bCrcCompSize++] = (crc >> 16) & 0xff;
      zip[bCrcCompSize++] = (crc >> 24);
    }

    // fill in compressed size
    zip[bCrcCompSize++] = compressedSize & 0xff;
    zip[bCrcCompSize++] = (compressedSize >> 8) & 0xff;
    zip[bCrcCompSize++] = (compressedSize >> 16) & 0xff;
    zip[bCrcCompSize++] = (compressedSize >> 24);
  }

  // write central directory
  const centralDirectoryOffset = b;
  for (let fileIndex = 0; fileIndex < numFiles; fileIndex++) {
    const
      localHeaderOffset = localHeaderOffsets[fileIndex],
      fileName = filePaths[fileIndex],
      fileNameSize = fileName.byteLength;

    // signature
    zip[b++] = 0x50; // P
    zip[b++] = 0x4b; // K
    zip[b++] = 0x01;
    zip[b++] = 0x02;
    // version created by
    zip[b] = 20;  // 2.0
    b += 2;  // 0 -> platform (MS-DOS)
    // version needed to extract
    zip[b] = 20;  // 2.0
    b += 2;  // 0
    // copy local header from [general purpose flag] to [extra field length]
    zip.set(zip.subarray(localHeaderOffset + 6, localHeaderOffset + 30), b);
    // file comment length, disk number, internal attr, external attr
    // 10 * 0
    b += 34;
    // local header offset
    zip[b++] = localHeaderOffset & 0xff;
    zip[b++] = (localHeaderOffset >> 8) & 0xff;
    zip[b++] = (localHeaderOffset >> 16) & 0xff;
    zip[b++] = (localHeaderOffset >> 24);
    // file name
    zip.set(fileName, b);
    b += fileNameSize;
  }

  // write end-of-central-directory record
  // signature
  zip[b++] = 0x50; // P
  zip[b++] = 0x4b; // K
  zip[b++] = 0x05;
  zip[b] = 0x06;
  // disk numbers x 2
  // 4 * 0
  b += 5;
  // disk entries
  zip[b++] = numFiles & 0xff;
  zip[b++] = (numFiles >> 8) & 0xff;
  // total entries
  zip[b++] = numFiles & 0xff;
  zip[b++] = (numFiles >> 8) & 0xff;
  // central directory size
  zip[b++] = centralDirectorySize & 0xff;
  zip[b++] = (centralDirectorySize >> 8) & 0xff;
  zip[b++] = (centralDirectorySize >> 16) & 0xff;
  zip[b++] = (centralDirectorySize >> 24);
  // central directory offset
  zip[b++] = centralDirectoryOffset & 0xff;
  zip[b++] = (centralDirectoryOffset >> 8) & 0xff;
  zip[b++] = (centralDirectoryOffset >> 16) & 0xff;
  zip[b] = (centralDirectoryOffset >> 24);
  // comment length
  // 0 
  // 0

  return zip.subarray(0, b + 3);
}
