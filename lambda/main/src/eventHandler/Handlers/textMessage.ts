import { TextEventMessage, TextMessage } from "@line/bot-sdk";
import { IMessageDb } from "database/dynamoDb/IMessageDb";

interface IReplyMessage {
    forUser: TextMessage,
    forHost: TextMessage
}

export interface ITextMessageHandler {
<<<<<<< HEAD
    messageHandler(textMessageEvent: TextEventMessage): Promise<Message | undefined>
    easterEggMessageHandler(textMessageEvent: TextEventMessage, userName: string): Promise<Message | undefined>
    incorrectMessageHandler(textMessageEvent: TextEventMessage): Message
=======
    messageHandler(textMessageEvent: TextEventMessage, userName: string): Promise<IReplyMessage>
>>>>>>> 99c5871f73bc511df2d940b03a9d149fcf13f9af
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

<<<<<<< HEAD
=======
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
                    text: `${userName} gets a correct message!!`
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

>>>>>>> 99c5871f73bc511df2d940b03a9d149fcf13f9af
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
            text: `${messageData.Name}\n${messageData.Message}`
        }
    }

<<<<<<< HEAD
    public async easterEggMessageHandler(textMessageEvent: TextEventMessage, userName: string): Promise<Message | undefined> {
        const userInput = textMessageEvent.text;

        const messageData = await this.messageDbClient.getEasterEgg(userInput);

        if (!messageData) {
            return undefined;
        };

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

        return undefined;

    }

    public incorrectMessageHandler(textMessageEvent: TextEventMessage): Message {
=======
    private async getEasterEggMessage(userInput: string, userName: string): Promise<TextMessage | null> {
>>>>>>> 99c5871f73bc511df2d940b03a9d149fcf13f9af

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

    private incorrectMessageHandler(incorrectMessage: string): TextMessage {

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
