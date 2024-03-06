
import { createZip } from './index';
import * as fs from 'node:fs';
import * as cp from 'node:child_process';

const testStr = "The quick brown fox jumps over the lazy dog.\n";

function makeTestZip() {
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

  return createZip(rawFiles)
}

async function test() {
  for (let i = 0; i < 1000; i++) {
    const zip = await makeTestZip();
    const file = `testfiles/f_${i}.zip`;
    fs.writeFileSync(file, zip);
    cp.execFileSync('/usr/bin/unzip', ['-t', file]);  // throws error on non-zero exit
  }
}

test();
