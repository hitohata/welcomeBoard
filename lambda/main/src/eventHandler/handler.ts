import { WebhookEvent, Message, TextMessage } from "@line/bot-sdk";
import { HostLineClient, UserLineClient } from "./lineClients";
import { IProfileHandler } from "./Handlers/profile";
import { IHelperHandler } from "./Handlers/help";
import { ITextMessageHandler } from "./Handlers/textMessage";

export class Handler {
    private readonly userLineClient: UserLineClient;
    private readonly hostLineClient: HostLineClient;
    private readonly helpHandler: IHelperHandler;
    private readonly profileHandler: IProfileHandler;
    private readonly textMessageHandler: ITextMessageHandler

    constructor(
        userLineClient: UserLineClient, 
        hostLineClient: HostLineClient,
        helperHandler: IHelperHandler,
        profileHandler: IProfileHandler,
        textMessageHandler: ITextMessageHandler
    ) {
        this.userLineClient = userLineClient;
        this.hostLineClient = hostLineClient;
        this.helpHandler = helperHandler;
        this.profileHandler = profileHandler;
        this.textMessageHandler = textMessageHandler;
    }

    public async checkEvent(event: WebhookEvent) {

        if (event.type === "message" && event.message.type === "text") {

            const replayToken = event.replyToken;

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

        if (event.type === "postback") {

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
    };

}
