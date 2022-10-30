import { TextMessageHandler } from "./textMessage";
import { IMessageDb } from "database/dynamoDb/IMessageDb";
import { ImageHandler } from "./image";
import { VideoHandler } from "./videoHandler";
import { InformationHandler } from "./informationHandler";
import { StickerHandler } from "./stickerHandler";
import { FollowEventHandler } from "./followHandler";
import { UserLineClient } from "eventHandler/lineClients";

export const handlersFactory = (messageDb: IMessageDb, lineClient: UserLineClient) => {
    return {
        textMessageHandler: new TextMessageHandler(messageDb),
        imageHandler: new ImageHandler(lineClient),
        videoHandler: new VideoHandler(lineClient),
        informationHandler: new InformationHandler(messageDb),
        stickerHandler: new StickerHandler(),
        followEventHandler: new FollowEventHandler(lineClient, messageDb)
    }
}
