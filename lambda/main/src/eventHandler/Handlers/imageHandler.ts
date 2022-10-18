import { ImageEventMessage } from "@line/bot-sdk";

export interface ImageHandler {
    handleImage(imageEvent: ImageEventMessage): void
};

export class ImageHandler {
    private readonly imageBucket
}
