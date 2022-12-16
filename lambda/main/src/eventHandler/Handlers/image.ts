import { ImageEventMessage, ImageMessage, TextMessage } from "@line/bot-sdk";
import { IDistribution } from "database/distribution/IDistribution";
import { IMessageDb } from "database/dynamoDb/IMessageDb";
import { IS3Bucket } from "database/s3Bucket/IS3Bucket";
import { ILineUserClient } from "lineClient/ILineClient";

export interface ImageHandler {
    handleImage(imageEvent: ImageEventMessage, userId: string): Promise<TextMessage | ImageMessage | void>
};

export class ImageHandler {
    private readonly lineClient: ILineUserClient;
    private readonly s3Client: IS3Bucket;
    private readonly messageDb: IMessageDb;
    private readonly distribution: IDistribution

    constructor(lineClient: ILineUserClient, s3Client: IS3Bucket, messageDb: IMessageDb, distribution: IDistribution) {
        this.lineClient = lineClient;
        this.s3Client = s3Client;
        this.messageDb = messageDb;
        this.distribution = distribution;
    }

    public async handleImage(imageEvent: ImageEventMessage, userId: string): Promise<TextMessage | ImageMessage | void> {

        const messageId = imageEvent.id;
        const filePrefix = `user-upload/image/userId=${userId}/${messageId}.jpeg`
        const imageReply = this.isReplyImage();

        // input image
        const contentStream = await this.lineClient.getMessageContent(messageId);
        await this.s3Client.putImage(filePrefix, contentStream);

        // when sending multiple image
        if (imageEvent.imageSet) {

            // the last image
            if (imageEvent.imageSet.total === imageEvent.imageSet.index) {
                return await this.replyContent(imageReply, filePrefix);
            };

            return;

        } else {

			return await this.replyContent(imageReply, filePrefix);

		}
    };

    private async replyContent(isReplayImage: boolean, filePrefix: string): Promise<TextMessage | ImageMessage> {
        if (isReplayImage) {
            return await this.imageMessage(filePrefix);
        };
        return this.textMessage();
    }

    private textMessage(): TextMessage {
        return {
            type: "text",
            text: "ありがとー"
        }
    }

    private async imageMessage(filePrefix: string): Promise<ImageMessage> {

        const imagePrefix = await this.messageDb.getImageUri();
        await this.messageDb.putImageUri(filePrefix);

        const distributionUri = this.distribution.userContentUri(imagePrefix.Uri);

        return {
            type: "image",
            originalContentUrl: distributionUri,
            previewImageUrl: distributionUri
        }

    }

    /**
     * Decide whether to reply with an image or text.
     * @returns 
     */
    private isReplyImage(): boolean {
        const seed = Math.floor(Math.random() * 10);

        if (seed === 5) { return true; };

        return false

    }
}
