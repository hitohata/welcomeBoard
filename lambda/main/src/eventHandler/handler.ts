import { Client, validateSignature, WebhookEvent, MessageEvent, PostbackEvent, Message, LocationMessage, TemplateMessage, TextMessage } from "@line/bot-sdk";
import { Settings } from "settings/settings";
import { LineClient } from "./eventHandler";
import { Helper } from "./Handlers/help";

export class Handler {
    private readonly lineUserClient: LineClient;

    constructor(lineUserClient: LineClient) {
        this.lineUserClient = lineUserClient;
    }

    public checkEvent(event: WebhookEvent) {

        if (event.type === "message" && event.message.type === "text") {

            const inputMessage = event.message.text;

            if (inputMessage === "help") {
                const helper = new Helper()
                const templateMessage = helper.helperTemplate();
                return;
            }

        }

        if (event.type === "postback") {
            const helper = new Helper()
            const helpMessage = helper.helpMessage(event);
            return;
        }
    };

}
