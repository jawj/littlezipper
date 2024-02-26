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
  textEncoder = new TextEncoder(),
  sum = (ns: number[]) => ns.reduce((memo, n) => memo + n, 0);

export const createZip = async (inputFiles: File[]) => {
  const
    localHeaderOffsets = [],
    numFiles = inputFiles.length,
    fileNames = inputFiles.map(file => textEncoder.encode(file.name)),
    fileData = inputFiles.map(({ data }) =>
      typeof data === 'string' ? textEncoder.encode(data) :
        data instanceof ArrayBuffer ? new Uint8Array(data) : data),
    totalDataSize = sum(fileData.map(data => data.byteLength)),
    fileNamesSize = sum(fileNames.map(name => name.byteLength)),
    localHeadersSize = numFiles * 30 + fileNamesSize,
    centralDirectorySize = numFiles * 46 + fileNamesSize,
    zipSize = localHeadersSize + totalDataSize + centralDirectorySize + 22 /* 22 = central directory end */,
    zip = new Uint8Array(zipSize),
    now = new Date();

  let b = 0;  // zip byte index

  // write local headers and file data
  for (let fileIndex = 0; fileIndex < numFiles; fileIndex++) {
    localHeaderOffsets[fileIndex] = b;

    const
      fileName = fileNames[fileIndex],
      fileNameSize = fileName.byteLength,
      data = fileData[fileIndex],
      dataSize = data.byteLength,
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
    zip[b] = 20;  // 2.0
    // + zero
    // general purpose flag
    b += 3; // 1 zeroes, + 1 above
    zip[b] = 0b1000;  // bit 11 (indexed from 0) => UTF-8 file names
    // compression
    b += 3; // 2 zeroes => no compression
    // mtime, mdate
    zip[b++] = mtime & 0xff;
    zip[b++] = mtime >> 8;
    zip[b++] = mdate & 0xff;
    zip[b++] = mdate >> 8;
    // crc32
    const crc = crc32(data);
    zip[b++] = crc & 0xff;
    zip[b++] = (crc >> 8) & 0xff;
    zip[b++] = (crc >> 16) & 0xff;
    zip[b++] = (crc >> 24);
    // compressed size followed by uncompressed size (the same)
    zip[b + 4] = zip[b++] = dataSize & 0xff;
    zip[b + 4] = zip[b++] = (dataSize >> 8) & 0xff;
    zip[b + 4] = zip[b++] = (dataSize >> 16) & 0xff;
    zip[b + 4] = zip[b] = (dataSize >> 24);
    b += 5;
    // file name length
    zip[b++] = fileNameSize & 0xff;
    zip[b] = (fileNameSize >> 8) & 0xff;
    // extra field length
    b += 3;  // 2 zeroes
    // file name
    zip.set(fileName, b);
    b += fileNameSize;
    // data
    zip.set(data, b);
    b += dataSize;
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
    zip[b] = 20;  // 2.0
    b += 2;  // zero => platform (MS-DOS)
    // version needed to extract
    zip[b] = 20;  // 2.0
    b += 2;  // zero
    // copy local header from [general purpose flag] to [extra field length]
    zip.set(zip.subarray(localHeaderOffset + 6, localHeaderOffset + 30), b);
    b += 24  // skip copied section
      // file comment length, disk number, internal attr, external attr
      + 10;  // zeroes
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
  b += 5;  // 4 zeroes
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
  b += 3;  // 2 zeroes

  return zip.subarray(0, b);
}
