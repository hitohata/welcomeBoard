import { ImageHandler } from "eventHandler/Handlers/image";
import { MockLineClient } from "../../lineClient/MockLineClient";
import { MockDistribution, MockMessageDb, MockS3Bucket } from "../../database";

describe("Image Handler", () => {
    test("reply image", async () => {
        const client = new MockLineClient();
        const mockMessageDb = new MockMessageDb();
        const imageHandler = new ImageHandler(client, new MockS3Bucket(), mockMessageDb, new MockDistribution());

        // return message reply
        const textReply = await imageHandler['replyContent'](false, "");
        expect(mockMessageDb.imageUri).toBe("default");
        expect(textReply.type).toBe("text");

        // return image url
        const imageReply = await imageHandler['replyContent'](true, "image/bucket.jpg");
        expect(mockMessageDb.imageUri).toBe("image/bucket.jpg");
        expect(imageReply.type).toBe("image");
        if (imageReply.type === "image") {
            expect(imageReply.originalContentUrl).toBe("host/default");
        }
    })
})
