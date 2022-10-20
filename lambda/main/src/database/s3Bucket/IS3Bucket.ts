import { Readable } from "node:stream";

export interface IS3Bucket {
    putImage(fileName: string, image: Readable): Promise<void>
}
