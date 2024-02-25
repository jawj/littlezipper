
let worstAbs = -Infinity;
let worstRel = -Infinity;

for (; ;) {
  await (async function () {
    const inputLength = Math.ceil(Math.random() * 65536);
    const inputData = crypto.getRandomValues(new Uint8Array(inputLength));

    const cstream = new CompressionStream('gzip');
    const writer = cstream.writable.getWriter();
    const reader = cstream.readable.getReader();

    writer.write(inputData);
    writer.close();

    let len = -18;  // header + crc/isize
    for (; ;) {
      const { done, value } = await reader.read();
      if (done) break;
      len += value.byteLength;
    }

    const absExpansion = len - inputLength;
    if (absExpansion > worstAbs) {
      worstAbs = absExpansion;
      console.log(`${worstAbs} bytes (input: ${inputLength})`);
    }
    const relExpansion = absExpansion / inputLength;
    if (relExpansion > worstRel) {
      worstRel = relExpansion;
      console.log(`${worstRel * 100}% (input: ${inputLength})`);
    }
  })();
}
