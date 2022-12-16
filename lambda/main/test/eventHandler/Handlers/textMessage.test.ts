import { TextMessageHandler } from "eventHandler/Handlers/textMessage";
import { MockMessageDb } from "../../database"

describe("text massage handler", () => {
    test("get message", async () => {
        const mockMessageDb = new MockMessageDb();
        const handler = new TextMessageHandler(mockMessageDb);

        const notFound = await handler["getMessage"]("InvalidKey", "name");
        expect(notFound).toBeNull();

        const incorrectUser = await handler["getMessage"]("key", "bar");
        expect(incorrectUser).toBeNull();

        const find = await handler["getMessage"]("key", "name");
        expect(find?.type).toBe("text");
    });

    test("get easter egg message", async () => {
        const mockMessageDb = new MockMessageDb();
        const handler = new TextMessageHandler(mockMessageDb);

        const notFound = await handler["getEasterEggMessage"]("bar", "bar");
        expect(notFound).toBeNull();

        const wildCard = await handler["getEasterEggMessage"]("wild", "ber");
        const wildCard2 = await handler["getEasterEggMessage"]("wild", "foo");

        expect(wildCard?.text).toBe("wild")
        expect(wildCard2?.text).toBe("wild")

        const incorrectUser = await handler["getEasterEggMessage"]("key", "bar");
        expect(incorrectUser).toBeNull();

        const correctUser = await handler["getEasterEggMessage"]("key", "default");
        expect(correctUser?.text).toBe("easter")

    });


})
