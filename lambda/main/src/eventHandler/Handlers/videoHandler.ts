import { TextMessage, VideoEventMessage, VideoMessage } from "@line/bot-sdk";
import { IDistribution } from "database/distribution/IDistribution";
import { IMessageDb } from "database/dynamoDb/IMessageDb";
import { IS3Bucket } from "database/s3Bucket/IS3Bucket";
import { ILineUserClient } from "lineClient/ILineClient";

export interface IVideoHandler {
    handleVideo(videoEvent: VideoEventMessage, userId: string): Promise<TextMessage | VideoMessage>
}

export class VideoHandler implements IVideoHandler {
    private readonly lineClient: ILineUserClient;
    private readonly s3Client: IS3Bucket;
    private readonly messageDb: IMessageDb;
    private readonly distribution: IDistribution;

    constructor(lineClient: ILineUserClient, s3Client: IS3Bucket, messageDb: IMessageDb, distribution: IDistribution) {
        this.lineClient = lineClient;
        this.s3Client = s3Client;
        this.messageDb = messageDb;
        this.distribution = distribution;
    };

    public async handleVideo(videoEvent: VideoEventMessage, userId: string): Promise<TextMessage | VideoMessage> {
        const videoId = videoEvent.id;

        const filePrefix = `user-upload/video/userId=${userId}/${videoId}.mp4`

        // put the video to the S3 bucket.
        const contentStream = await this.lineClient.getMessageContent(videoId);
        await this.s3Client.putVideo(filePrefix, contentStream);

        return await this.replyContent(this.isReplyVideo(), filePrefix);

    }

    private async replyContent(isReplyVideo: boolean, filePrefix: string): Promise<TextMessage | VideoMessage> {
        if (isReplyVideo) {
            return await this.videoMessage(filePrefix);
        }

        return this.textMessage();
    }

    private textMessage(): TextMessage {
        return {
            type: "text",
            text: "うれしー"
        }
    }

    private async videoMessage(filePrefix: string): Promise<VideoMessage> {
        const storedVideoPrefix = await this.messageDb.getVideoUri();

        await this.messageDb.putVideoUri(filePrefix);

        const distributionUri = this.distribution.userContentUri(storedVideoPrefix.Uri);

        return {
            type: "video",
            originalContentUrl: distributionUri,
            previewImageUrl: distributionUri
        }
    }

    private isReplyVideo(): boolean {
        const seed = Math.floor(Math.random() * 3);
        if (seed === 0) {
            return true;
        };
        return false;
    }

}
