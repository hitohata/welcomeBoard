import { WebhookEvent, Message, TextMessage, MessageEvent, PostbackEvent } from "@line/bot-sdk";
import { HostLineClient, UserLineClient } from "./lineClients";
import { ITextMessageHandler } from "./Handlers/textMessage";
import { ImageHandler } from "./Handlers/image";
import { IInformationHandler } from "./Handlers/informationHandler";
import { IStickerHandler } from "./Handlers/stickerHandler";
import { IVideoHandler } from "./Handlers/videoHandler";
import { IFollowHandler } from "./Handlers/followHandler";

interface IReplayMessage {
    userReplay: Message | Message[],
    hostBroadcast: Message | Message[]
}

export class Handler {
    private readonly userLineClient: UserLineClient;
    private readonly hostLineClient: HostLineClient;
    private readonly textMessageHandler: ITextMessageHandler
    private readonly imageHandler: ImageHandler;
    private readonly videoHandler: IVideoHandler;
    private readonly informationHandler: IInformationHandler;
    private readonly stickerHandler: IStickerHandler;
    private readonly followEventHandler: IFollowHandler

    constructor(
        userLineClient: UserLineClient,
        hostLineClient: HostLineClient,
        textMessageHandler: ITextMessageHandler,
        imageHandler: ImageHandler,
        videoHandler: IVideoHandler,
        informationHandler: IInformationHandler,
        stickerHandler: IStickerHandler,
        followEventHandler: IFollowHandler
    ) {
        this.userLineClient = userLineClient;
        this.hostLineClient = hostLineClient;
        this.textMessageHandler = textMessageHandler;
        this.imageHandler = imageHandler;
        this.videoHandler = videoHandler;
        this.informationHandler = informationHandler;
        this.stickerHandler = stickerHandler;
        this.followEventHandler = followEventHandler;
    }

    public async checkEvent(event: WebhookEvent): Promise<void> {

        if (event.type === "message") {
            const replayToken = event.replyToken;

            if (event.message.type === "text") {

                const message = await this.textMessageHandling(event);

                if (message) {
                    await Promise.all([
                        this.userLineClient.replyMessage(replayToken, message.userReplay),
                        this.hostLineClient.broadcast(message.hostBroadcast)
                    ])
                }
            };

            if (event.message.type === "image" && event.source.userId) {

                // this is for the beta
                const userName = await this.userLineClient.getUserName(event);
                await Promise.all([
                    this.userLineClient.replyMessage(replayToken, {
                        type: "text",
                        text: "画像も付けてないんですよー。すいませーん。"
                    }),
                    this.hostLineClient.broadcast({
                        type: "text",
                        text: `${userName} has uploaded an image(s). ID: ${event.message.id}`
                    })
                ]);

                return;

                const userId = event.source.userId;
                await this.imageHandler.handleImage(event.message, userId);
                return;
            };

            if (event.message.type === "video" && event.message.contentProvider.type === "line" && event.source.userId) {

                const userName = await this.userLineClient.getUserName(event);

                // this is for the beta test.
                await Promise.all([
                    this.userLineClient.replyMessage(replayToken, {
                        type: "text",
                        text: "動画はなおさらですー。すいませーん。"
                    }),
                    this.hostLineClient.broadcast({
                        type: "text",
                        text: `${userName} has uploaded a video(s). ID: ${event.message.id}`
                    })
                ]);
                return;

                await this.videoHandler.handleVideo(event.message, event.source.userId);
                return;
            }

            // replay sticker
            if (event.message.type === "sticker") {
                const replyStickerMessage = await this.stickerHandler.getPositiveStickerMessage();

                await this.userLineClient.replyMessage(event.replyToken, replyStickerMessage)
                return;
            }
        };

        if (event.type === "postback") {
            const replayToken = event.replyToken;
            const message = await this.postbackEventHandling(event);
            if (message) {
                await this.userLineClient.replyMessage(replayToken, message)
                return;
            }
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

    /**
     * replay message
     * @param event MessageEvent
     * @returns
     */
    private async textMessageHandling(event: MessageEvent): Promise<IReplayMessage | undefined> {

        if (event.message.type !== "text") {
            throw new Error("Not a text");
        }

        const userName = await this.userLineClient.getUserName(event);

        const [
            // message,
            easterEggMessage
        ] = await Promise.all([
            // this.textMessageHandler.messageHandler(event.message),
            this.textMessageHandler.easterEggMessageHandler(event.message, userName)
        ]);

        if (easterEggMessage) {
            const easterToHost: TextMessage = {
                type: "text",
                text: `${userName} gets a easter egg message.`
            }

            return {
                userReplay: easterEggMessage,
                hostBroadcast: easterToHost
            }
        }

        //this is test
        return {
            userReplay: {
                type: "text",
                text: "まだ受け付けてないんですよー。すいませーん。"
            },
            hostBroadcast: {
                type: "text",
                text: `${userName} < ${event.message.text}`
            }
        }

        // get correct message
        /*
        if (message) {

            const correctMessage: TextMessage = {
                type: "text",
                text: `${userName} gets a correct message!!`
            };

            return {
                userReplay: message,
                hostBroadcast: correctMessage
            }
        }
        */

        const incorrectMessage = this.textMessageHandler.incorrectMessageHandler(event.message);
        const negativeSticker = this.stickerHandler.getNegativeStickerMessage()

        const toHostMessage: TextMessage = {
                type: "text",
                text: `${userName} < ${event.message.text}`
            }

        return {
            userReplay: [negativeSticker, incorrectMessage],
            hostBroadcast: toHostMessage
        }

    }

    // return information
    private async postbackEventHandling(event: PostbackEvent): Promise<Message | Message[] | undefined> {
        const replyToken = event.replyToken;

        const postBackData = event.postback.data;

        if (postBackData === this.informationHandler.location) {
            return await this.informationHandler.locationInformation();
        };

        if (postBackData === this.informationHandler.dateTime) {
            return await this.informationHandler.dateTimeInformation();
        };

        if (postBackData === this.informationHandler.groomProfile) {
            return await this.informationHandler.getGroomProfileMessage();
        };

        if (postBackData === this.informationHandler.brideProfile) {
            return await this.informationHandler.getBrideProfileMessage();
        };

        if (postBackData === this.informationHandler.menu) {
            return this.informationHandler.menuImageMessage();
        };

        if (postBackData === this.informationHandler.seatingChart) {
            return this.informationHandler.seatingChartImageMessage();
        };

        return undefined;
    }

}
