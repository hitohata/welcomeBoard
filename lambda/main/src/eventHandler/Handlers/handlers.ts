import { Client } from "@line/bot-sdk";
import { TextMessageHandler } from "./textMessage";
import { IMessageDb } from "database/dynamoDb/IMessageDb";
import { ImageHandler } from "./image";
import { InformationHandler } from "./informationHandler";

export const handlersFactory = (messageDb: IMessageDb, lineClient: Client) => {
    return {
        textMessageHandler: new TextMessageHandler(messageDb),
        imageHandler: new ImageHandler(lineClient),
        informationHandler: new InformationHandler(messageDb)
    }
}
