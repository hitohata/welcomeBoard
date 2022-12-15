import { VideoHandler } from "eventHandler/Handlers/videoHandler";
import { MockLineClient } from "../../lineClient/MockLineClient";
import { MockDistribution, MockMessageDb, MockS3Bucket } from "../../database";

describe("Image Handler", () => {
    test("reply image", async () => {
        const client = new MockLineClient();
        const mockMessageDb = new MockMessageDb();
        const imageHandler = new VideoHandler(client, new MockS3Bucket(), mockMessageDb, new MockDistribution());

        // return message reply
        const textReply = await imageHandler['replyContent'](false, "");
        expect(mockMessageDb.videoUri).toBe("default");
        expect(textReply.type).toBe("text");

        // return image url
        const imageReply = await imageHandler['replyContent'](true, "video/bucket.jpg");
        expect(mockMessageDb.videoUri).toBe("video/bucket.jpg");
        expect(imageReply.type).toBe("video");
        if (imageReply.type === "video") {
            expect(imageReply.originalContentUrl).toBe("host/default");
        }
    })
})
