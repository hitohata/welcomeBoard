import { TextMessageHandler } from "./textMessage";
import { ImageHandler } from "./image";
import { VideoHandler } from "./videoHandler";
import { PostBackHandler } from "./postbackHandler";
import { StickerHandler } from "./stickerHandler";
import { FollowEventHandler } from "./followHandler";
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
        stickerHandler: new StickerHandler(),
        followEventHandler: new FollowEventHandler(lineClient, messageDb)
    }
}
