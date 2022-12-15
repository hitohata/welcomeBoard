import { FollowEvent, Message, MessageEvent } from "@line/bot-sdk";
import { ILineUserClient } from "lineClient/ILineClient";
import { Readable } from "stream";

export class MockLineClient implements ILineUserClient {
    async replyMessage(replyToken: string, message: Message | Message[]): Promise<void> {}
    async getUserName(event: MessageEvent | FollowEvent): Promise<string> {
        return "userName"
    };
    async getMessageContent(messageId: string): Promise<Readable> {
        return new Readable()
    }
}
