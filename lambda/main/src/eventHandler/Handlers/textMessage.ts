import { Message, TextEventMessage, TextMessage } from "@line/bot-sdk";
import { IMessageDb } from "database/dynamoDb/IMessageDb";
import { StickerHandler } from "./stickerHandler";

interface IReplyMessage {
    forUser: Message | Message[],
    forHost: TextMessage
}

export interface ITextMessageHandler {
    messageHandler(textMessageEvent: TextEventMessage, userName: string): Promise<IReplyMessage>
}

export class TextMessageHandler implements ITextMessageHandler {

    private readonly messageDbClient: IMessageDb;

    constructor(
        messageDbClient: IMessageDb,
    ) {
        this.messageDbClient = messageDbClient;
    };

    public async messageHandler(textMessageEvent: TextEventMessage, userName: string): Promise<IReplyMessage> {

        const userInput = textMessageEvent.text;

        const [message, easterEggMessage] = await Promise.all([
            this.getMessage(userInput, userName),
            this.getEasterEggMessage(userInput, userName)
        ])

        // get correct message
        if (message) {
            return {
                forUser: message,
                forHost: {
                    type: "text",
                    text: `${userName} gets a correct message!!\nInput: ${userInput}`
                }
            }
        }

        if (easterEggMessage) {
            return {
                forUser: easterEggMessage,
                forHost: {
                    type: "text",
                    text: `${userName} gets an easter egg message.\nInput: ${userInput}`
                }
            }
        }

        return {
            forUser: this.incorrectMessageHandler(userInput),
            forHost: {
                type: "text",
                text: `${userName} < ${userInput}`
            }
        }
    }

    private async getMessage(userInput: string, userName: string): Promise<TextMessage | null> {

        const messageData = await this.messageDbClient.getMessage(userInput);

        if (!messageData) {
            return null;
        };

        // is not for appropriate user
        if (messageData.Name !== userName) {
            return null;
        }

        return {
            type: "text",
            text: `${messageData.Message}`
        }
    }

    private async getEasterEggMessage(userInput: string, userName: string): Promise<TextMessage | null> {

        const messageData = await this.messageDbClient.getEasterEgg(userInput);

        if (!messageData) {
            return null;
        };

        // for wild card
        if (messageData.TargetUsers.length === 0) {
            return {
                type: "text",
                text: messageData.Message
            }
        }

        if (messageData.TargetUsers.some(user => user === userName)) {
            return {
                type: "text",
                text: messageData.Message
            }
        };

        return null;

    }

    private incorrectMessageHandler(incorrectMessage: string): Message[] {

        const seed = Math.floor(Math.random() * 5);
        let message = "";
        const stickerHandler = new StickerHandler();

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

        return [{
            type: "text",
            text: message
        }, stickerHandler.getNegativeStickerMessage()];
    }

}
