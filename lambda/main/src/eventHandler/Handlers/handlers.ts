import { Client } from "@line/bot-sdk";
import { HelperHandler } from "./help";
import { TextMessageHandler } from "./textMessage";
import { ProfileHandler } from "./profile";
import { IMessageDb } from "database/dynamoDb/IMessageDb";
import { ImageHandler } from "./image";

export const handlersFactory = (messageDb: IMessageDb, lineClient: Client) => {
    return {
        helperHandler: new HelperHandler(messageDb),
        textMessageHandler: new TextMessageHandler(messageDb),
        profileHandler: new ProfileHandler(messageDb),
        imageHandler: new ImageHandler(lineClient)
    }
}
