import { S3Client, PutObjectCommandInput } from "@aws-sdk/client-s3";

export class S3ImageBucket {
    private readonly client: S3Client; 
    private readonly bucketName: string;

    constructor() {
        this.client = new S3Client({ region: process.env.REGION });
        this.bucketName = process.env.IMAGE_BUCKET_NAME!;
    };
    
    putImage() {

    const fileName = "a.jpg";

        const putObjectInput: PutObjectCommandInput = {
            Bucket: this.bucketName,
            Key: `upload-bucket/${fileName}`,
        };
    }
}
