import { Client, VideoEventMessage } from "@line/bot-sdk";
import { IS3Bucket } from "database/s3Bucket/IS3Bucket";
import { S3ImageBucket } from "database/s3Bucket/S3Bucket";


export interface IVideoHandler {
    handleVideo(videoEvent: VideoEventMessage, userId: string): Promise<void>
}

export class VideoHandler implements IVideoHandler {
    private readonly lineClient: Client;
    private readonly s3Client: IS3Bucket;

    constructor(lineClient: Client) {
        this.lineClient = lineClient;
        this.s3Client = new S3ImageBucket()
    };

    public async handleVideo(videoEvent: VideoEventMessage, userId: string): Promise<void> {
        const videoId = videoEvent.id;

        const contentStream = await this.lineClient.getMessageContent(videoId);

        await this.s3Client.putVideo(`userId=${userId}/${videoId}`, contentStream);

        return;
    }

}
