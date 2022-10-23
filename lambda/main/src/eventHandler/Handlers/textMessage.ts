import { Message, TextEventMessage } from "@line/bot-sdk";
import { IMessageDb } from "database/dynamoDb/IMessageDb";

export interface ITextMessageHandler {
    messageHandler(textMessageEvent: TextEventMessage): Promise<Message | undefined>
    incorrectMessageHandler(textMessageEvent: TextEventMessage): Message
}

export class TextMessageHandler implements ITextMessageHandler {

    private readonly messageDbClient: IMessageDb;

    constructor(
        messageDbClient: IMessageDb,
    ) {
        this.messageDbClient = messageDbClient;
    };

    public async messageHandler(textMessageEvent: TextEventMessage): Promise<Message | undefined> {

        const userInput = textMessageEvent.text;

        const messageData = await this.messageDbClient.getMessage(userInput); 

        if (!messageData) {
            return undefined;
        };

        return {
            type: "text",
            text: `${messageData.Name}\n${messageData.Message}`
        }
    }

    public incorrectMessageHandler(textMessageEvent: TextEventMessage): Message {

        const incorrectMessage = textMessageEvent.text;

        const seed = Math.floor(Math.random() * 5);
        let message = "";

        if (incorrectMessage.length < 5) {
         switch (seed) {
                case 1: {
                    message = `${incorrectMessage} とはどういういみですか`;
                    break;
                }
                case 2: {
                    const toList = Array.from(incorrectMessage);
                    message = toList.join("w");
                    break;
                }
                case 3: {
                    message = `${incorrectMessage} とは`;
                    break;
                }
                case 4: {
                    message = "Not Found";
                    break;
                }
                default: {
                    message = "あー…"
                }
            }
        } else {
            switch (seed) {
                case 1: {
                    message = `入力した文字は${incorrectMessage}でした。\nちがいます。`;
                    break;
                }
                case 2: {
                    message = "残念";
                    break;
                }
                case 3: {
                    message = `${incorrectMessage} だと思いましたか。ちがいます。`;
                    break;
                }
                case 4: {
                    message = "違うんだよなぁ";
                    break;
                }
                default: {
                    message = "はぁ…"
                }
            }
        }

        return {
            type: "text",
            text: message
        }
    }

}
