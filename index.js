"use strict";
// references:
// https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip.html
// https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZip = void 0;
const crc32_1 = require("./crc32");
const hasCompressionStreams = typeof CompressionStream !== 'undefined', textEncoder = new TextEncoder(), sum = (ns) => ns.reduce((memo, n) => memo + n, 0);
async function createZip(inputFiles, compressWhenPossible = true) {
    var _a;
    const deflate = hasCompressionStreams && compressWhenPossible, localHeaderOffsets = [], fileNames = inputFiles.map(file => textEncoder.encode(file.name)), fileData = inputFiles.map(({ data }) => typeof data === 'string' ? textEncoder.encode(data) :
        data instanceof ArrayBuffer ? new Uint8Array(data) : data), 
    // worst-case data expansion is 5b per 32K: https://www.w3.org/Graphics/PNG/RFC-1951
    maxCompressedSizes = fileData.map(data => data.byteLength + 5 * Math.ceil(data.byteLength / 32768)), numFiles = fileNames.length, maxSize = 22 + // end of central directory record
        numFiles * 30 + // local file headers (minus file names)
        numFiles * 46 + // central directory file headers (minus file names)
        sum(fileNames.map(name => name.byteLength)) * 2 + // file names (in local + central directory headers)
        sum(maxCompressedSizes), // file data
    zip = new Uint8Array(maxSize), now = new Date();
    let i = 0; // zip byte index
    // files with local headers
    for (let fileIndex = 0; fileIndex < numFiles; fileIndex++) {
        localHeaderOffsets[fileIndex] = i;
        let compressed, compressedSize;
        const fileName = fileNames[fileIndex], fileNameSize = fileName.byteLength, uncompressed = fileData[fileIndex], uncompressedSize = uncompressed.byteLength, crc = (0, crc32_1.crc32)(uncompressed), maxCompressedSize = maxCompressedSizes[fileIndex], lastModified = (_a = inputFiles[fileIndex].lastModified) !== null && _a !== void 0 ? _a : now, sec = lastModified.getSeconds(), min = lastModified.getMinutes(), hr = lastModified.getHours(), day = lastModified.getDate(), mth = lastModified.getMonth() + 1, yr = lastModified.getFullYear(), mtime = Math.floor(sec / 2) + (min << 5) + (hr << 11), mdate = day + (mth << 5) + ((yr - 1980) << 9);
        // signature
        zip[i++] = 0x50; // P
        zip[i++] = 0x4b; // K
        zip[i++] = 0x03;
        zip[i++] = 0x04;
        // version needed to extract
        zip[i++] = 20; // 2.0
        zip[i++] = 0;
        // general purpose flag
        zip[i++] = 0;
        zip[i++] = 0b1000; // bit 11 (indexed from 0) => UTF-8 file names
        // compression
        zip[i++] = deflate ? 8 : 0; // deflate or none
        zip[i++] = 0;
        // mtime, mdate
        zip[i++] = mtime & 0xff;
        zip[i++] = mtime >> 8;
        zip[i++] = mdate & 0xff;
        zip[i++] = mdate >> 8;
        // crc32
        zip[i++] = crc & 0xff;
        zip[i++] = (crc >> 8) & 0xff;
        zip[i++] = (crc >> 16) & 0xff;
        zip[i++] = (crc >> 24);
        // compressed size (come back later)
        let compressedSizeOffset = i;
        i += 4;
        // uncompressed size
        zip[i++] = uncompressedSize & 0xff;
        zip[i++] = (uncompressedSize >> 8) & 0xff;
        zip[i++] = (uncompressedSize >> 16) & 0xff;
        zip[i++] = (uncompressedSize >> 24);
        // file name length
        zip[i++] = fileNameSize & 0xff;
        zip[i++] = (fileNameSize >> 8) & 0xff;
        // extra field length
        zip[i++] = 0;
        zip[i++] = 0;
        // file name
        zip.set(fileName, i);
        i += fileNameSize;
        // compressed data
        if (deflate) {
            const cstream = new CompressionStream('deflate-raw'), writer = cstream.writable.getWriter(), reader = cstream.readable.getReader();
            await writer.ready;
            await writer.write(uncompressed);
            await writer.ready;
            await writer.close();
            compressedSize = 0;
            for (;;) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                zip.set(value, i);
                compressedSize += value.length;
                i += value.length;
            }
        }
        else {
            zip.set(uncompressed, i);
            compressedSize = uncompressedSize;
            i += uncompressedSize;
        }
        // compressed size
        zip[compressedSizeOffset++] = compressedSize & 0xff;
        zip[compressedSizeOffset++] = (compressedSize >> 8) & 0xff;
        zip[compressedSizeOffset++] = (compressedSize >> 16) & 0xff;
        zip[compressedSizeOffset++] = (compressedSize >> 24);
    }
    // central directory
    const centralDirectoryOffset = i;
    for (let fileIndex = 0; fileIndex < numFiles; fileIndex++) {
        const localHeaderOffset = localHeaderOffsets[fileIndex], fileName = fileNames[fileIndex], fileNameSize = fileName.byteLength;
        // signature
        zip[i++] = 0x50; // P
        zip[i++] = 0x4b; // K
        zip[i++] = 0x01;
        zip[i++] = 0x02;
        // version created by
        zip[i++] = 20; // 2.0
        zip[i++] = 0; // platform (MS-DOS)
        // version needed to extract
        zip[i++] = 20; // 2.0
        zip[i++] = 0;
        // copy local header from [general purpose flag] to [extra field length]
        zip.set(zip.subarray(localHeaderOffset + 6, localHeaderOffset + 30), i);
        i += 24;
        // file comment length, disk number, internal attr, external attr
        for (let j = 0; j < 10; j++)
            zip[i++] = 0;
        // local header offset
        zip[i++] = localHeaderOffset & 0xff;
        zip[i++] = (localHeaderOffset >> 8) & 0xff;
        zip[i++] = (localHeaderOffset >> 16) & 0xff;
        zip[i++] = (localHeaderOffset >> 24);
        // file name
        zip.set(fileName, i);
        i += fileNameSize;
    }
    const centralDirectorySize = i - centralDirectoryOffset;
    // end of central directory record
    // signature
    zip[i++] = 0x50; // P
    zip[i++] = 0x4b; // K
    zip[i++] = 0x05;
    zip[i++] = 0x06;
    // disk numbers x 2
    zip[i++] = 0;
    zip[i++] = 0;
    zip[i++] = 0;
    zip[i++] = 0;
    // disk entries
    zip[i++] = numFiles & 0xff;
    zip[i++] = (numFiles >> 8) & 0xff;
    // total entries
    zip[i++] = numFiles & 0xff;
    zip[i++] = (numFiles >> 8) & 0xff;
    // central directory size
    zip[i++] = centralDirectorySize & 0xff;
    zip[i++] = (centralDirectorySize >> 8) & 0xff;
    zip[i++] = (centralDirectorySize >> 16) & 0xff;
    zip[i++] = (centralDirectorySize >> 24);
    // central directory offset
    zip[i++] = centralDirectoryOffset & 0xff;
    zip[i++] = (centralDirectoryOffset >> 8) & 0xff;
    zip[i++] = (centralDirectoryOffset >> 16) & 0xff;
    zip[i++] = (centralDirectoryOffset >> 24);
    // comment length
    zip[i++] = 0;
    zip[i++] = 0;
    return zip.subarray(0, i);
}
exports.createZip = createZip;
