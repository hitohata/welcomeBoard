<<<<<<< HEAD
import { Client, FollowEvent, Message, User } from "@line/bot-sdk";
import { IMessageDb } from "database/dynamoDb/IMessageDb";
import { UserLineClient } from "eventHandler/lineClients";
=======
import { FollowEvent, Message } from "@line/bot-sdk";
import { IMessageDb } from "database/dynamoDb/IMessageDb";
import { ILineUserClient } from "lineClient/ILineClient";
>>>>>>> 99c5871f73bc511df2d940b03a9d149fcf13f9af

export interface IFollowHandler {
    handleFollowEvent(followEvent: FollowEvent): Promise<Message>
}

export class FollowEventHandler {
<<<<<<< HEAD
    private readonly lineClient: UserLineClient;
    private readonly messageDb: IMessageDb

    constructor(lineClient: UserLineClient, messageDb: IMessageDb) {
=======
    private readonly lineClient: ILineUserClient;
    private readonly messageDb: IMessageDb

    constructor(lineClient: ILineUserClient, messageDb: IMessageDb) {
>>>>>>> 99c5871f73bc511df2d940b03a9d149fcf13f9af
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
