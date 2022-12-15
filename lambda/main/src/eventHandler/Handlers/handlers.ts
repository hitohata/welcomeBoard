import { TextMessageHandler } from "./textMessage";
import { ImageHandler } from "./image";
import { VideoHandler } from "./videoHandler";
import { PostBackHandler } from "./postbackHandler";
import { StickerHandler } from "./stickerHandler";
import { FollowEventHandler } from "./followHandler";
<<<<<<< HEAD
import { UserLineClient } from "eventHandler/lineClients";

export const handlersFactory = (messageDb: IMessageDb, lineClient: UserLineClient) => {
    return {
        textMessageHandler: new TextMessageHandler(messageDb),
        imageHandler: new ImageHandler(lineClient),
        videoHandler: new VideoHandler(lineClient),
        informationHandler: new InformationHandler(messageDb),
=======
import { Distribution } from "database/distribution/Distribution";
import { S3ImageBucket } from "database/s3Bucket/S3Bucket";
import { MessageDb } from "database/dynamoDb/messageDb";
import { ILineUserClient } from "lineClient/ILineClient";

export const handlersFactory = (lineClient: ILineUserClient) => {

    const messageDb = new MessageDb()
    const s3Bucket = new S3ImageBucket();
    const distribution = new Distribution();

    return {
        textMessageHandler: new TextMessageHandler(messageDb),
        imageHandler: new ImageHandler(lineClient, s3Bucket, messageDb, distribution),
        videoHandler: new VideoHandler(lineClient, s3Bucket, messageDb, distribution),
        informationHandler: new PostBackHandler(messageDb, distribution),
>>>>>>> 99c5871f73bc511df2d940b03a9d149fcf13f9af
        stickerHandler: new StickerHandler(),
        followEventHandler: new FollowEventHandler(lineClient, messageDb)
    }
}
