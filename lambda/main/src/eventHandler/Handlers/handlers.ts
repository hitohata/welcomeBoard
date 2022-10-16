import { HelperHandler } from "./help";
import { TextMessageHandler } from "./textMessage";
import { ProfileHandler } from "./profile";
import { IMessageDb } from "database/IMessageDb";

export const handlersFactory = (messageDb: IMessageDb) => {
    return {
        helperHandler: new HelperHandler(messageDb),
        textMessageHandler: new TextMessageHandler(messageDb),
        profileHandler: new ProfileHandler(messageDb)
    }
}
