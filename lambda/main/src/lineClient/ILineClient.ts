import { FollowEvent, Message, MessageEvent } from "@line/bot-sdk";
import { Readable } from "stream";

export interface ILineUserClient {
    replyMessage(replyToken: string, message: Message | Message[]): Promise<void>
    getUserName(event: MessageEvent | FollowEvent): Promise<string>
    getMessageContent(messageId: string): Promise<Readable>
}

export interface ILineHostClient {
    broadcast(message: Message | Message[]): Promise<void>
}
