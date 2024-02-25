// references:
// https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip.html
// https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT
// https://www.rfc-editor.org/rfc/rfc1952

import { crc32 } from './crc32';

export interface File {
  data: string | ArrayBuffer | Uint8Array;
  name: string;
  lastModified?: Date;
}

const
  hasCompressionStreams = typeof CompressionStream !== 'undefined',
  textEncoder = new TextEncoder(),
  sum = (ns: number[]) => ns.reduce((memo, n) => memo + n, 0),
  gzipHeaderBytes = 10;

export async function createZip(inputFiles: File[], compressWhenPossible = true) {
  const
    localHeaderOffsets = [],
    deflate = hasCompressionStreams && compressWhenPossible,
    numFiles = inputFiles.length,
    fileNames = inputFiles.map(file => textEncoder.encode(file.name)),
    fileData = inputFiles.map(({ data }) =>
      typeof data === 'string' ? textEncoder.encode(data) :
        data instanceof ArrayBuffer ? new Uint8Array(data) : data),
    totalDataSize = sum(fileData.map(data => data.byteLength)),
    fileNamesSize = sum(fileNames.map(name => name.byteLength)),
    localHeadersSize =
      numFiles * 30 +  // local file headers (minus file names)
      fileNamesSize,
    centralDirectorySize =
      numFiles * 46  // central directory file headers (minus file names)
      + fileNamesSize,
    centralDirectoryEndSize = 22,
    // in theory, max deflate overhead should be 5b per 32K, but this doesn't appear to be true
    maxZipSize = 
      localHeadersSize + centralDirectorySize + centralDirectoryEndSize
      + Math.ceil(totalDataSize * 1.01)  // allow 1% expansion (worst seen was 0.1%)
      + numFiles * 128,  // plus an extra 128b per file (worst seen was 12b)
    zip = new Uint8Array(maxZipSize),
    now = new Date();

  let b = 0;  // zip byte index

  // write local headers and compressed files
  for (let fileIndex = 0; fileIndex < numFiles; fileIndex++) {
    localHeaderOffsets[fileIndex] = b;

    const
      fileName = fileNames[fileIndex],
      fileNameSize = fileName.byteLength,
      uncompressed = fileData[fileIndex],
      uncompressedSize = uncompressed.byteLength,
      lastModified = inputFiles[fileIndex].lastModified ?? now,
      sec = lastModified.getSeconds(),
      min = lastModified.getMinutes(),
      hr = lastModified.getHours(),
      day = lastModified.getDate(),
      mth = lastModified.getMonth() + 1,
      yr = lastModified.getFullYear(),
      mtime = Math.floor(sec / 2) + (min << 5) + (hr << 11),
      mdate = day + (mth << 5) + ((yr - 1980) << 9);

    // signature
    zip[b++] = 0x50; // P
    zip[b++] = 0x4b; // K
    zip[b++] = 0x03;
    zip[b++] = 0x04;
    // version needed to extract
    zip[b++] = 20;  // 2.0
    zip[b++] = 0;
    // general purpose flag
    zip[b++] = 0;
    zip[b++] = 0b1000;  // bit 11 (indexed from 0) => UTF-8 file names
    // compression
    zip[b++] = deflate ? 8 : 0;  // deflate or none
    zip[b++] = 0;
    // mtime, mdate
    zip[b++] = mtime & 0xff;
    zip[b++] = mtime >> 8;
    zip[b++] = mdate & 0xff;
    zip[b++] = mdate >> 8;
    // crc32 (come back later)
    let crcOffset = b;
    b += 4;
    // compressed size (come back later)
    let compressedSizeOffset = b;
    b += 4;
    // uncompressed size
    zip[b++] = uncompressedSize & 0xff;
    zip[b++] = (uncompressedSize >> 8) & 0xff;
    zip[b++] = (uncompressedSize >> 16) & 0xff;
    zip[b++] = (uncompressedSize >> 24);
    // file name length
    zip[b++] = fileNameSize & 0xff;
    zip[b++] = (fileNameSize >> 8) & 0xff;
    // extra field length
    zip[b++] = 0;
    zip[b++] = 0;
    // file name
    zip.set(fileName, b);
    b += fileNameSize;

    // compressed data
    let compressedSize: number;
    if (deflate) {
      const
        compressedStart = b,
        cstream = new CompressionStream('gzip'),
        writer = cstream.writable.getWriter(),
        reader = cstream.readable.getReader();

      writer.write(uncompressed);
      writer.close();

      let
        bytesStartOffset = 0,
        bytesEndOffset = 0;

      // skip gzip header
      // note: we assume no optional fields, which makes the header exactly 10 bytes
      // this seems logical, and is safe in Firefox, Chrome, Safari, Edge, Node, Deno at the time of writing
      // (Bun doesn't currently implement CompressionStream)
      for (; ;) {
        const data = await reader.read();
        if (data.done) throw new Error('Unexpected end of gzip data');

        const bytes: Uint8Array = data.value;
        bytesStartOffset = bytesEndOffset;
        bytesEndOffset = bytesStartOffset + bytes.length;
        if (bytesStartOffset <= 2 && bytesEndOffset > 2) {
          const cmp = bytes[2 - bytesStartOffset];
          if (cmp !== 8) throw new Error(`Assumptions violated: gzip not deflated (compression value: ${cmp})`);
        }
        if (bytesStartOffset <= 3 && bytesEndOffset > 3) {
          const flags = bytes[3 - bytesStartOffset];
          if (flags & 0b11110) throw new Error(`Assumptions violated: one or more optional gzip flags present (flags: ${flags})`);
        }
        if (bytesEndOffset === gzipHeaderBytes) break;  // header ended neatly on chunk boundary
        if (bytesEndOffset > gzipHeaderBytes) {
          const dataBytes = bytes.subarray(gzipHeaderBytes - bytesStartOffset);
          zip.set(dataBytes, b);
          b += dataBytes.byteLength;
          break;
        }
      }

      // copy remainder of data
      for (; ;) {
        const data = await reader.read();
        if (data.done) break;

        const bytes: Uint8Array = data.value;
        zip.set(bytes, b);
        b += bytes.byteLength;
      }

      // backtrack and retrieve CRC
      b -= 8;
      zip[crcOffset++] = zip[b++];
      zip[crcOffset++] = zip[b++];
      zip[crcOffset++] = zip[b++];
      zip[crcOffset++] = zip[b++];
      b -= 4;

      compressedSize = b - compressedStart;

    } else {
      zip.set(uncompressed, b);
      b += uncompressedSize;
      compressedSize = uncompressedSize;

      // now calculate CRC ourselves
      const crc = crc32(uncompressed);
      zip[b++] = crc & 0xff;
      zip[b++] = (crc >> 8) & 0xff;
      zip[b++] = (crc >> 16) & 0xff;
      zip[b++] = (crc >> 24);
    }

    // fill in compressed size
    zip[compressedSizeOffset++] = compressedSize & 0xff;
    zip[compressedSizeOffset++] = (compressedSize >> 8) & 0xff;
    zip[compressedSizeOffset++] = (compressedSize >> 16) & 0xff;
    zip[compressedSizeOffset++] = (compressedSize >> 24);
  }

  // write central directory
  const centralDirectoryOffset = b;
  for (let fileIndex = 0; fileIndex < numFiles; fileIndex++) {
    const
      localHeaderOffset = localHeaderOffsets[fileIndex],
      fileName = fileNames[fileIndex],
      fileNameSize = fileName.byteLength;

    // signature
    zip[b++] = 0x50; // P
    zip[b++] = 0x4b; // K
    zip[b++] = 0x01;
    zip[b++] = 0x02;
    // version created by
    zip[b++] = 20;  // 2.0
    zip[b++] = 0;   // platform (MS-DOS)
    // version needed to extract
    zip[b++] = 20;  // 2.0
    zip[b++] = 0;
    // copy local header from [general purpose flag] to [extra field length]
    zip.set(zip.subarray(localHeaderOffset + 6, localHeaderOffset + 30), b);
    b += 24;
    // file comment length, disk number, internal attr, external attr
    for (let j = 0; j < 10; j++) zip[b++] = 0;
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
  zip[b++] = 0x06;
  // disk numbers x 2
  zip[b++] = 0;
  zip[b++] = 0;
  zip[b++] = 0;
  zip[b++] = 0;
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
  zip[b++] = (centralDirectoryOffset >> 24);
  // comment length
  zip[b++] = 0;
  zip[b++] = 0;

  return zip.subarray(0, b);
}
