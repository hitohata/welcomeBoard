import { Client, validateSignature, WebhookEvent, MessageEvent, PostbackEvent, Message, LocationMessage, TemplateMessage, TextMessage } from "@line/bot-sdk";
import { Settings } from "settings/settings";
import { HostLineClient, UserLineClient } from "./lineClients";
import { Helper } from "./Handlers/help";
import { MessageDb } from "database/messageDb";

export class Handler {
    private readonly userLineClient: UserLineClient;
    private readonly hostLineClient: HostLineClient;

    constructor(userLineClient: UserLineClient, hostLineClient: HostLineClient) {
        this.userLineClient = userLineClient;
        this.hostLineClient = hostLineClient;
    }

    public async checkEvent(event: WebhookEvent) {

        if (event.type === "message" && event.message.type === "text") {

            const replayToken = event.replyToken;

            const inputMessage = event.message.text;

            if (inputMessage === "help") {
                const helper = new Helper()
                const templateMessage = helper.helperTemplate();
                await this.userLineClient.replyMessage(replayToken, templateMessage);
                return;
            }

            const messageDbClient = new MessageDb();

            const [userName, messageReply] = Promise.all([
                this.userLineClient.getUserName(event),
                messageDbClient.getMessage(inputMessage)
            ])

            await Promise.all([
                this.userLineClient.replyMessage(replayToken, {
                    type: "text",
                    text: inputMessage
                }),
                this.hostLineClient.broadcast({
                    type: "text",
                    text: `${userName} < ${inputMessage}`
                })
            ])

        }

        if (event.type === "postback") {

            const replyToken = event.replyToken;

            const helper = new Helper()
            const helpMessage = await helper.helpMessage(event);

            await this.userLineClient.replyMessage(replyToken, helpMessage);
            return;
        }
    };

}
