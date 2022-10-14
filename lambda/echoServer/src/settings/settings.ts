export class Settings {
    private readonly channelToken: string;
    private readonly channelSecret: string;

    private constructor() {
        const channelSecret = process.env.CHANNEL_SECRET;
        const channelAccessToken = process.env.CHANNEL_TOKEN;

        if(!(channelSecret && channelAccessToken)) {
            throw new Error("Token not found!");
        };

        this.channelToken = channelAccessToken;
        this.channelSecret = channelSecret;
    }

    public get userChannelConfig() {
        return {
            channelSecret: this.channelSecret,
            channelToken: this.channelToken
        }
    }

    public static create(): Settings {
        return new Settings();
    }
}
