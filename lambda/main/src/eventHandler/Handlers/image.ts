import { Client, ImageEventMessage } from "@line/bot-sdk";
import { IS3Bucket } from "database/s3Bucket/IS3Bucket";
import { S3ImageBucket } from "database/s3Bucket/S3Bucket";

export interface ImageHandler {
    handleImage(imageEvent: ImageEventMessage): void
};

export class ImageHandler {
    private readonly lineClient: Client; 
    private readonly s3Client: IS3Bucket;

    constructor(lineClient: Client) {
        this.lineClient = lineClient;
        this.s3Client = new S3ImageBucket();
    }

    public async handleImage(imageEvent: ImageEventMessage): Promise<void> {

        const messageId = imageEvent.id;

        const contentStream = await this.lineClient.getMessageContent(messageId);

        await this.s3Client.putImage(messageId, contentStream);

        return;
    };

}
