
import { createZip } from './index';
import * as fs from 'node:fs';
import * as cp from 'node:child_process';

const testStr = "The quick brown fox jumps over the lazy dog.\n";

function makeTestZip(makeReadFn: undefined | typeof makeByteByByteReadFn) {
  const rawFiles = [];
  let i = 0;
  do {
    i++;
    const maxDataLength = [16, 1024, 65536][Math.floor(Math.random() * 3)];
    const dataLength = Math.floor(Math.random() * maxDataLength);
    let data;
    if (Math.random() < .5) {
      data = testStr.repeat(Math.ceil(dataLength / testStr.length)).slice(0, dataLength);
    } else {
      data = new Uint8Array(dataLength);
      crypto.getRandomValues(data as Uint8Array);
    }
    rawFiles.push({
      name: `f_${i}.${typeof data === 'string' ? 'txt' : 'bin'}`,
      data,
    });
  } while (Math.random() < 0.5);

  return createZip(rawFiles, true, makeReadFn);
}

function makeByteByByteReadFn(dataIn: Uint8Array) {
  const
    cs = new CompressionStream('gzip'),
    writer = cs.writable.getWriter(),
    reader = cs.readable.getReader();

  writer.write(dataIn);
  writer.close();

  let
    buffer: Uint8Array | undefined,
    bufferIndex: number;

  return async () => {
    if (buffer !== undefined && bufferIndex < buffer.byteLength) {
      return { value: buffer.subarray(bufferIndex, ++bufferIndex), done: false };
    }
    const { value, done } = await reader.read();
    if (done) {
      return { value, done };

    } else {
      buffer = value as Uint8Array;
      bufferIndex = 0;
      return { value: buffer.subarray(bufferIndex, ++bufferIndex), done: false };
    }
  }
}

function makeAllInOneReadFunction(dataIn: Uint8Array) {
  const
    cs = new CompressionStream('gzip'),
    writer = cs.writable.getWriter(),
    reader = cs.readable.getReader();

  writer.write(dataIn);
  writer.close();

  let 
    buffer = new Uint8Array(),
    returned = false;

  return async () => {
    if (returned) {
      return { value: undefined as any, done: true };
    }
    for (; ;) {
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
  }
}

async function test() {
  for (const makeReadFn of [undefined, makeByteByByteReadFn, makeAllInOneReadFunction]) {
    console.log(makeReadFn?.name);
    for (let i = 0; i < 1000; i++) {
      const zip = await makeTestZip(makeReadFn);
      const file = `testfiles/f_${i}.zip`;
      fs.writeFileSync(file, zip);
      cp.execFileSync('/usr/bin/unzip', ['-t', file]);  // throws error on non-zero exit
    }
  }
}

test();
