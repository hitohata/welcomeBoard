import { FollowEvent, Message } from "@line/bot-sdk";
import { IMessageDb } from "database/dynamoDb/IMessageDb";
import { ILineUserClient } from "lineClient/ILineClient";

export interface IFollowHandler {
    handleFollowEvent(followEvent: FollowEvent): Promise<Message>
}

export class FollowEventHandler {
    private readonly lineClient: ILineUserClient;
    private readonly messageDb: IMessageDb

    constructor(lineClient: ILineUserClient, messageDb: IMessageDb) {
        this.lineClient = lineClient;
        this.messageDb = messageDb;
    }

    public async handleFollowEvent(followEvent: FollowEvent): Promise<Message> {

        const [userName, currentUserList] = await Promise.all([
            this.lineClient.getUserName(followEvent),
            this.messageDb.getActiveUserNames()
        ])

        const updatedUserList = this.updateUsersList(currentUserList, userName);

        await this.messageDb.putActiveUserName(updatedUserList);

        return {
            type: "text",
            text: `${userName} has joined to the wedding line channel.`
        }
    }

    private updateUsersList(userList: string[], userName: string): string[] {
        // if already existing do nothing.
        if (userList.some((user) => user === userName)) {
            return userList;
        };

        userList.push(userName);
        return userList
    }

}
