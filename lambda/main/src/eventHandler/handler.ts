import { WebhookEvent } from "@line/bot-sdk";
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
                await Promise.all([
                    this.userLineClient.replyMessage(replayToken, message),
                    this.hostLineClient.replyMessage(replayToken, {
                        type: "text",
                        text: `${userName} get a correct message!!`
                    })
                ])
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

            const helpMessage = await this.helpHandler.helpMessage(event);

            await this.userLineClient.replyMessage(replyToken, helpMessage);
            return;
        }
    };

}
