# littlezip

This project uses the `CompressionStream` facility — supported by all recent browsers, Node and Deno — to create `.zip` files.

This is not entirely trivial since, a little frustratingly, `CompressionStream` can natively produce `.gz` format data but not a `.zip`. Thus, we pick out both the deflated data and the CRC from the `.gz` stream, and write them into a `.zip` file instead.

Because we don't actually have to implement deflate compression, the library is fast and small.

Where `CompressionStream` is not available, we fall back to producing uncompressed `.zip` files, and calculate the CRC in heavily-optimized JavaScript.

The library is currently suitable for small- and medium-sized files, since it briefly requires just over 2x the total uncompressed size of your files in memory. That's because you pass it an array of files data, and for the `.zip` output it allocates a `Uint8Array` backed by a worst-case `ArrayBuffer`, the size all the uncompressed data plus a little more for headers.

Potential future improvements could include implementing this instead as a transform stream, which could enable smaller memory use and larger file sizes. However, since the `.zip` format annoyingly puts the CRC and compressed data size _before_ the compressed data, we might end up having to do the compression step twice this way.
