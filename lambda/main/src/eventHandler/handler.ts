import { WebhookEvent, Message, TextMessage, MessageEvent, PostbackEvent } from "@line/bot-sdk";
import { HostLineClient, UserLineClient } from "./lineClients";
import { ITextMessageHandler } from "./Handlers/textMessage";
import { ImageHandler } from "./Handlers/image";
import { IInformationHandler } from "./Handlers/informationHandler";
import { IStickerHandler } from "./Handlers/stickerHandler";

export class Handler {
    private readonly userLineClient: UserLineClient;
    private readonly hostLineClient: HostLineClient;
    private readonly textMessageHandler: ITextMessageHandler
    private readonly imageHandler: ImageHandler;
    private readonly informationHandler: IInformationHandler;
    private readonly stickerHandler: IStickerHandler;

    constructor(
        userLineClient: UserLineClient,
        hostLineClient: HostLineClient,
        textMessageHandler: ITextMessageHandler,
        imageHandler: ImageHandler,
        informationHandler: IInformationHandler,
        stickerHandler: IStickerHandler
    ) {
        this.userLineClient = userLineClient;
        this.hostLineClient = hostLineClient;
        this.textMessageHandler = textMessageHandler;
        this.imageHandler = imageHandler;
        this.informationHandler = informationHandler;
        this.stickerHandler = stickerHandler;
    }

    public async checkEvent(event: WebhookEvent): Promise<void> {

        if (event.type === "message") {
            if (event.message.type === "text") {
                await this.textMessageHandling(event);
                return;
            };

            if (event.message.type === "image") {
                await this.imageHandler.handleImage(event.message);
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
            await this.postbackEventHandling(event);
            return;
        }
    };

    /**
     * replay message
     * @param event MessageEvent
     * @returns
     */
    private async textMessageHandling(event: MessageEvent): Promise<void> {

        const replayToken = event.replyToken;

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

            await Promise.all([
                this.userLineClient.replyMessage(replayToken, message),
                this.hostLineClient.broadcast(correctMessage)
            ]);

            return;
        }

        const incorrectMessage = this.textMessageHandler.incorrectMessageHandler(event.message);
        const negativeSticker = this.stickerHandler.getNegativeStickerMessage()

        await Promise.all([
            this.userLineClient.replyMessage(replayToken, [
                negativeSticker,
                incorrectMessage
            ]),
            this.hostLineClient.broadcast({
                type: "text",
                text: `${userName} < ${event.message.text}`
            })
        ])
    }

    // return information
    private async postbackEventHandling(event: PostbackEvent): Promise<void> {
        const replyToken = event.replyToken;

        const postBackData = event.postback.data;

        let message: Message | Message[] = {
            type: "text",
            text: "Not Found"
        };

        if (postBackData === this.informationHandler.location) {
            message = await this.informationHandler.locationInformation();
        };

        if (postBackData === this.informationHandler.dateTime) {
            message = await this.informationHandler.dateTimeInformation();
        };

        if (postBackData === this.informationHandler.groomProfile) {
            message = await this.informationHandler.getGroomProfileMessage();
        };

        if (postBackData === this.informationHandler.brideProfile) {
            message = await this.informationHandler.getBrideProfileMessage();
        };

        if (postBackData === this.informationHandler.menu) {
            message = this.informationHandler.menuImageMessage();
        };

        if (postBackData === this.informationHandler.seatingChart) {
            message = this.informationHandler.seatingChartImageMessage();
        }

        await this.userLineClient.replyMessage(replyToken, message);
        return;
    }

}
