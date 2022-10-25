import { Client, validateSignature, MessageEvent } from "@line/bot-sdk";
import { Settings } from "settings/settings";


export class UserLineClient extends Client {

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

        super({
            channelAccessToken: userChannelConfig.channelAccessToken,
            channelSecret: userChannelConfig.channelSecret
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

export class HostLineClient extends Client {
    constructor() {
        const hostChannelConfig = Settings.create().hostChannelConfig;
        super({
            channelAccessToken: hostChannelConfig.channelAccessToken,
            channelSecret: hostChannelConfig.channelSecret
        })
    }
}
