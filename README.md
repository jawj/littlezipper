# LittleZIP

This project uses the `CompressionStream` facility in all recent browsers, Node and Deno to create .zip files.

This is not entirely trivial since, a little frustratingly, `CompressionStream` can natively produce a .gz file but not a .zip. Thus we pick out the compressed data and CRC from a .gz stream, and write them into a .zip format instead.

Because we don't have to reimplement DEFLATE compression, the library is fast and small.

Where `CompressionStream` is not available, we produce uncompressed .zip files, calculating the CRC in JavaScript.

Potential future improvements could include implementing this as a transform stream, which might enable larger file sizes. However, since the .zip format annoyingly puts the CRC and compressed size before the compressed data, we might end up having to do the compression twice this way.
