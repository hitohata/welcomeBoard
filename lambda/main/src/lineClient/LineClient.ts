import { Client, validateSignature, MessageEvent, FollowEvent, Message } from "@line/bot-sdk";
import { Settings } from "settings/settings";
import { Readable } from "stream";
import { ILineHostClient, ILineUserClient } from "./ILineClient";


export class UserLineClient implements ILineUserClient {

    private readonly lineClient: Client;

    constructor (signature?: string, body?: string | null) {

        if (!signature) {
            throw new Error("signature is not provided!");
        }

        if (!body) {
            throw new Error("No Body!");
        }

        const settings = Settings.create();
        const userChannelConfig = settings.userChannelConfig;

        if (!(validateSignature(body
        , userChannelConfig.channelSecret, signature))) {
            throw new Error("Invalid signature.");
        };

        const client = new Client({
            channelAccessToken: userChannelConfig.channelAccessToken,
            channelSecret: userChannelConfig.channelSecret
        });

        this.lineClient = client;
    };

    public async replyMessage(replyToken: string, message: Message): Promise<void> {
        await this.lineClient.replyMessage(replyToken, message);
    }

    /**
     * get a user profile and return the user name.
     * @param event 
     * @returns 
     */
    public async getUserName(event: MessageEvent | FollowEvent): Promise<string> {

        const userId = event.source.userId; 
        const userProfile = await this.lineClient.getProfile(userId!);
        return userProfile.displayName;
    }

    public async getMessageContent(messageId: string): Promise<Readable> {
       return await this.lineClient.getMessageContent(messageId);
    }

}

export class HostLineClient implements ILineHostClient {
    private readonly lineClient: Client;
    constructor() {
        const hostChannelConfig = Settings.create().hostChannelConfig;
        const client = new Client({
            channelAccessToken: hostChannelConfig.channelAccessToken,
            channelSecret: hostChannelConfig.channelSecret
        });
        this.lineClient = client;
    };

    public async broadcast(message: Message): Promise<void> {
        await this.lineClient.broadcast(message);
    }
}
