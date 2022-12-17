import { WebhookEvent } from "@line/bot-sdk";
import { ITextMessageHandler } from "./Handlers/textMessage";
import { ImageHandler } from "./Handlers/image";
import { IPostBackHandler } from "./Handlers/postbackHandler";
import { IStickerHandler } from "./Handlers/stickerHandler";
import { IVideoHandler } from "./Handlers/videoHandler";
import { IFollowHandler } from "./Handlers/followHandler";
import { ILineHostClient, ILineUserClient } from "lineClient/ILineClient";

export class Handler {
    private readonly userLineClient: ILineUserClient;
    private readonly hostLineClient: ILineHostClient;
    private readonly textMessageHandler: ITextMessageHandler
    private readonly imageHandler: ImageHandler;
    private readonly videoHandler: IVideoHandler;
    private readonly postBackHandler: IPostBackHandler;
    private readonly stickerHandler: IStickerHandler;
    private readonly followEventHandler: IFollowHandler

    constructor(
        userLineClient: ILineUserClient,
        hostLineClient: ILineHostClient,
        textMessageHandler: ITextMessageHandler,
        imageHandler: ImageHandler,
        videoHandler: IVideoHandler,
        postBackHandler: IPostBackHandler,
        stickerHandler: IStickerHandler,
        followEventHandler: IFollowHandler
    ) {
        this.userLineClient = userLineClient;
        this.hostLineClient = hostLineClient;
        this.textMessageHandler = textMessageHandler;
        this.imageHandler = imageHandler;
        this.videoHandler = videoHandler;
        this.postBackHandler = postBackHandler;
        this.stickerHandler = stickerHandler;
        this.followEventHandler = followEventHandler;
    }

    public async checkEvent(event: WebhookEvent): Promise<void> {

        if (event.type === "message") {
            const replayToken = event.replyToken;

            if (event.message.type === "text") {

                const userName = await this.userLineClient.getUserName(event);

                const replyMessage = await this.textMessageHandler.messageHandler(event.message, userName);

                await Promise.all([
                    this.userLineClient.replyMessage(replayToken, replyMessage.forUser),
                    this.hostLineClient.broadcast(replyMessage.forHost)
                ])

                return;
            };

            if (event.message.type === "image" && event.source.userId) {

                const userId = event.source.userId;
                const message = await this.imageHandler.handleImage(event.message, userId);

                if (message) {
                    await this.userLineClient.replyMessage(replayToken, message);
                }

                return;
            };

            if (event.message.type === "video" && event.message.contentProvider.type === "line" && event.source.userId) {

                const message = await this.videoHandler.handleVideo(event.message, event.source.userId);

                if (message) {
                    await this.userLineClient.replyMessage(replayToken, message);
                }

                return;
            }

            // replay sticker
            if (event.message.type === "sticker") {
                const replyStickerMessage = this.stickerHandler.getPositiveStickerMessage();

                await this.userLineClient.replyMessage(event.replyToken, replyStickerMessage)
                return;
            }
        };

        if (event.type === "postback") {
            const replayToken = event.replyToken;
            const message = await this.postBackHandler.postbackEventHandler(event);
            await this.userLineClient.replyMessage(replayToken, message)
            return;
        };

        if (event.type === "follow") {

            const followNotificationMessage = await this.followEventHandler.handleFollowEvent(event)

            await this.hostLineClient.broadcast(followNotificationMessage);

            return;
        }

        console.error(event);

        this.hostLineClient.broadcast({
            type: "text",
            text: JSON.stringify(event.toString())
        })

        return;
    };

}
