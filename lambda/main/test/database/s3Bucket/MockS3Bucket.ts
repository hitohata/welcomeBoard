import { IS3Bucket } from "database/s3Bucket/IS3Bucket";
import { Readable } from "stream";

export class MockS3Bucket implements IS3Bucket {
    async putImage(fileName: string, image: Readable): Promise<void> {}
    async putVideo(fileName: string, video: Readable): Promise<void> {}
}
