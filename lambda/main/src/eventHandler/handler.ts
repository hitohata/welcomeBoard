import { WebhookEvent, Message, TextMessage, MessageEvent, PostbackEvent } from "@line/bot-sdk";
import { HostLineClient, UserLineClient } from "./lineClients";
import { ITextMessageHandler } from "./Handlers/textMessage";
import { ImageHandler } from "./Handlers/image";
import { IInformationHandler } from "./Handlers/informationHandler";
import { IStickerHandler } from "./Handlers/stickerHandler";
import { IVideoHandler } from "./Handlers/videoHandler";
import { env } from "process";

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

    constructor(
        userLineClient: UserLineClient,
        hostLineClient: HostLineClient,
        textMessageHandler: ITextMessageHandler,
        imageHandler: ImageHandler,
        videoHandler: IVideoHandler,
        informationHandler: IInformationHandler,
        stickerHandler: IStickerHandler
    ) {
        this.userLineClient = userLineClient;
        this.hostLineClient = hostLineClient;
        this.textMessageHandler = textMessageHandler;
        this.imageHandler = imageHandler;
        this.videoHandler = videoHandler;
        this.informationHandler = informationHandler;
        this.stickerHandler = stickerHandler;
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
                ])}
            };

            if (event.message.type === "image") {
                await this.imageHandler.handleImage(event.message);
                return;
            };

            if (event.message.type === "video" && event.message.contentProvider.type === "line") {
                await this.videoHandler.handleVideo(event.message);
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
            const message = await this.postbackEventHandling(event);
            if (message) {
                await this.userLineClient.replyMessage(replayToken, message)
                return;
            }
        };

        if (event.type === "memberJoined") {
            const userNames = await Promise.all(
                event.joined.members.map((async (el) => {
                    const userProfile = await this.userLineClient.getProfile(el.userId);
                    return userProfile.displayName;
                }))
            )

            await this.hostLineClient.broadcast({
                type: "text",
                text: userNames.join(",")
            })
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

        const [message, userName]= await Promise.all([
            this.textMessageHandler.messageHandler(event.message),
            this.userLineClient.getUserName(event)
        ]);

        // get correct message
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
