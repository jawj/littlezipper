# littlezipper

This project uses the `CompressionStream` API — supported by all recent browsers, Node and Deno — to create `.zip` files.

This is not wholly trivial since, a little frustratingly, `CompressionStream` can natively produce `.gz` format data but not `.zip`. Thus, we pick out both the deflated data and the CRC from the `.gz` stream, and write them into a `.zip` file instead.

We don't actually have to implement any compression in JavaScript, so the library is fast and small.

Where `CompressionStream` is not available, we fall back to producing uncompressed `.zip` files (and calculate the CRC in heavily-optimized JavaScript). This may be acceptable if you are creating a `.zip` that is actually something else, such as an `.xlsx`, `.apk` or `.xpi`.

The library is currently suitable for small- and medium-sized files, since it briefly requires just over 2x the total uncompressed size of your files in memory. That's because you pass it an array of files data, and for the `.zip` output it allocates a `Uint8Array` backed by a worst-case `ArrayBuffer`, which is the size of all the uncompressed data plus a little more for headers.

Potential future improvements could include implementing a `TransformStream` instead, which could enable smaller memory use and larger file sizes. However, the `.zip` format annoyingly puts the CRC and compressed data size _before_ the compressed data, which limits opportunities for memory saving.

## Installation

```bash
npm install littlezipper
```

TypeScript types are included.

## Usage

The library exposes a single function, `createZip`.

```typescript
import { createZip } from 'littlezipper'; 

const zip = await createZip([
  { path: 'test.txt', data: 'This is a test', lastModified: new Date('2020-01-01T00:00:00') },
  { path: 'test.bin', data: new Uint8Array([1, 2, 3]) },
]);
```

The first argument to `createZip` is an array of file entries. Each entry must have `path` (`string`) and `data` (`string`, `Uint8Array` or `ArrayBuffer`) keys, and may have a `lastModified` (`Date`) key, which otherwise defaults to the current date and time.

The optional second argument defines whether we attempt to deflate the data (default: `true`). If `false`, the resulting `.zip` file will be as large as the input data plus a few bytes for headers.

## License

[Apache License, Version 2.0](LICENSE).
