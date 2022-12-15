import { WebhookEvent } from "@line/bot-sdk";
import { ITextMessageHandler } from "./Handlers/textMessage";
import { ImageHandler } from "./Handlers/image";
import { IPostBackHandler } from "./Handlers/postbackHandler";
import { IStickerHandler } from "./Handlers/stickerHandler";
import { IVideoHandler } from "./Handlers/videoHandler";
import { IFollowHandler } from "./Handlers/followHandler";
<<<<<<< HEAD

interface IReplayMessage {
    userReplay: Message | Message[],
    hostBroadcast: Message | Message[]
}
=======
import { ILineHostClient, ILineUserClient } from "lineClient/ILineClient";
>>>>>>> 99c5871f73bc511df2d940b03a9d149fcf13f9af

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
<<<<<<< HEAD
        informationHandler: IInformationHandler,
=======
        postBackHandler: IPostBackHandler,
>>>>>>> 99c5871f73bc511df2d940b03a9d149fcf13f9af
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

<<<<<<< HEAD
                const message = await this.textMessageHandling(event);

                if (message) {
                    await Promise.all([
                        this.userLineClient.replyMessage(replayToken, message.userReplay),
                        this.hostLineClient.broadcast(message.hostBroadcast)
                    ])
                }
=======
                const userName = await this.userLineClient.getUserName(event);

                const replyMessage = await this.textMessageHandler.messageHandler(event.message, userName);

                await Promise.all([
                    this.userLineClient.replyMessage(replayToken, replyMessage.forUser),
                    this.hostLineClient.broadcast(replyMessage.forHost)
                ])

                return;
>>>>>>> 99c5871f73bc511df2d940b03a9d149fcf13f9af
            };

            if (event.message.type === "image" && event.source.userId) {

<<<<<<< HEAD
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

=======
>>>>>>> 99c5871f73bc511df2d940b03a9d149fcf13f9af
                const userId = event.source.userId;
                const message = await this.imageHandler.handleImage(event.message, userId);

                if (message) {
                    await this.userLineClient.replyMessage(replayToken, message);
                }

                return;
            };

            if (event.message.type === "video" && event.message.contentProvider.type === "line" && event.source.userId) {

<<<<<<< HEAD
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
=======
                const message = await this.videoHandler.handleVideo(event.message, event.source.userId);

                if (message) {
                    await this.userLineClient.replyMessage(replayToken, message);
                }

>>>>>>> 99c5871f73bc511df2d940b03a9d149fcf13f9af
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

<<<<<<< HEAD
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

=======
>>>>>>> 99c5871f73bc511df2d940b03a9d149fcf13f9af
}
