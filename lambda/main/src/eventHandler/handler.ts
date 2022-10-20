import { WebhookEvent, Message, TextMessage, MessageEvent, PostbackEvent } from "@line/bot-sdk";
import { HostLineClient, UserLineClient } from "./lineClients";
import { IProfileHandler } from "./Handlers/profile";
import { IHelperHandler } from "./Handlers/help";
import { ITextMessageHandler } from "./Handlers/textMessage";
import { ImageHandler } from "./Handlers/image";

export class Handler {
    private readonly userLineClient: UserLineClient;
    private readonly hostLineClient: HostLineClient;
    private readonly helpHandler: IHelperHandler;
    private readonly profileHandler: IProfileHandler;
    private readonly textMessageHandler: ITextMessageHandler
    private readonly imageHandler: ImageHandler;

    constructor(
        userLineClient: UserLineClient,
        hostLineClient: HostLineClient,
        helperHandler: IHelperHandler,
        profileHandler: IProfileHandler,
        textMessageHandler: ITextMessageHandler,
        imageHandler: ImageHandler,
    ) {
        this.userLineClient = userLineClient;
        this.hostLineClient = hostLineClient;
        this.helpHandler = helperHandler;
        this.profileHandler = profileHandler;
        this.textMessageHandler = textMessageHandler;
        this.imageHandler = imageHandler;
    }

    public async checkEvent(event: WebhookEvent) {

        if (event.type === "message") {
            if (event.message.type === "text") {
                await this.textMessageHandling(event);
                return;
            };

            if (event.message.type === "image") {
                await this.imageHandler.handleImage(event.message);
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

        const userInput = event.message.text;

        if (userInput === "help") {

            const templateMessage = this.helpHandler.helperTemplate();
            await this.userLineClient.replyMessage(replayToken, templateMessage);

            return;
        }

        if (userInput === "profile") {

            const templateMessage = this.profileHandler.profileTemplate();
            await this.userLineClient.replyMessage(replayToken, templateMessage);

            return;
        };

        const [message, userName]= await Promise.all([
            this.textMessageHandler.messageHandler(event.message),
            this.userLineClient.getUserName(event)
        ]);

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

        await Promise.all([
            this.userLineClient.replyMessage(replayToken, incorrectMessage),
            this.hostLineClient.broadcast({
                type: "text",
                text: `${userName} < ${event.message.text}`
            })
        ])
    }

    private async postbackEventHandling(event: PostbackEvent): Promise<void> {
        const replyToken = event.replyToken;

        const postBackData = event.postback.data;

        let message: Message = {
            type: "text",
            text: "Not Found"
        }

        if (postBackData === this.helpHandler.location) {
            message = await this.helpHandler.locationInformation();
        };

        if (postBackData === this.helpHandler.dateTime) {
            message = await this.helpHandler.dateTimeInformation();
        };

        if (postBackData === this.profileHandler.groomProfile) {
            message = await this.profileHandler.groomProfileMessage()
        };

        if (postBackData === this.profileHandler.brideProfile) {
            message = await this.profileHandler.brideProfileMessage();
        }

        await this.userLineClient.replyMessage(replyToken, message);
        return;
    }

}
