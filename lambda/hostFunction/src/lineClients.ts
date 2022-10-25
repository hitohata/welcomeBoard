import { Client, validateSignature, MessageEvent } from "@line/bot-sdk";

export class HostLineClient extends Client {

    constructor (signature?: string, body?: string | null) {

        if (!signature) {
            throw new Error("signature is not provided!");
        }

        if (!body) {
            throw new Error("No Body!");
        }

        const channelSecret = process.env.MANAGER_CHANNEL_SECRET!;
        const channelAccessToken = process.env.MANAGER_CHANNEL_TOKEN!;

        if (!(validateSignature(body, channelSecret, signature))) {
            throw new Error("Invalid signature.");
        };

        super({
            channelAccessToken: channelAccessToken,
            channelSecret: channelSecret
        })
    };

    /**
     * get a user profile and return the user name.
     * @param event 
     * @returns 
     */
    public async getUserName(event: MessageEvent): Promise<string> {

        const userId = event.source.userId; 
        const userProfile = await this.getProfile(userId!);
        return userProfile.displayName;
    }

}

export class UserLineClient extends Client {
    constructor() {
        const token = process.env.CHANNEL_TOKEN;
        const secret = process.env.CHANNEL_SECRET;
        super({
            channelAccessToken: token!,
            channelSecret: secret
        })
    }
}
