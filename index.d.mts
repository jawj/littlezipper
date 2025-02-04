
export interface UncompressedFile {
  path: string;
  data: string | Uint8Array | ArrayBuffer;
  lastModified?: Date;
}

/**
 * 
 * @param inputFiles Array of input file objects, of the form `{ path: string; data: string | Uint8Array | ArrayBuffer; lastModified?: Date; }`.
 * @param compressWhenPossible If `false`, files are archived without compression. Default is `true`.
 */
export function createZip(inputFiles: UncompressedFile[], compressWhenPossible?: boolean): Promise<Uint8Array>;
