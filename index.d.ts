
export interface File {
  name: string;
  data: string | ArrayBuffer | Uint8Array;
  lastModified?: Date;
}

export function createZip(inputFiles: File[], compressWhenPossible?: boolean): Promise<Uint8Array>;
