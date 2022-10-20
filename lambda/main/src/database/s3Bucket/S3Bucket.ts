import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "node:stream";

export class S3ImageBucket {
    private readonly client: S3Client; 
    private readonly bucketName: string;

    constructor() {
        this.client = new S3Client({ region: process.env.REGION });
        this.bucketName = process.env.IMAGE_BUCKET_NAME!;
    };

    public async putImage(fileName: string, image: Readable): Promise<void> {

        const parallelUploader = new Upload({
            client: this.client,
            params: {
                Bucket: this.bucketName,
                Key: `upload-image/${fileName}.jpeg`,
                Body: image
            }
        })

        await parallelUploader.done();

    }
}
