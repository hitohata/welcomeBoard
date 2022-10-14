import { Client, validateSignature, WebhookEvent, MessageEvent } from "@line/bot-sdk";
import { Settings } from "settings/settings";


export class LineClient {

    private lineClient: Client;

    constructor (signature?: string, body?: string) {

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

        this.lineClient = new Client({
            channelAccessToken: userChannelConfig.channelToken,
            channelSecret: userChannelConfig.channelSecret
        });
    };

    public async replayMessage(event: WebhookEvent) {
        // const replayMessage = event.
        this.lineClient.replyMessage()
    }

    /**
     * get a user profile and return the user name.
     * @param event 
     * @returns 
     */
    private async getUserName(event: MessageEvent): Promise<string> {

        const userId = event.source.userId; 
        const userProfile = await this.lineClient.getProfile(userId!);
        return userProfile.displayName;
    }   

}
