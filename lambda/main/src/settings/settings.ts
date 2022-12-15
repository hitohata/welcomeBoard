export class Settings {
    private readonly channelToken: string;
    private readonly channelSecret: string;
    private readonly managerChannelToken: string;
    private readonly managerChannelSecret: string;

    private constructor() {
        const channelSecret = process.env.CHANNEL_SECRET;
        const channelAccessToken = process.env.CHANNEL_TOKEN;
        const managerChannelSecret = process.env.MANAGER_CHANNEL_SECRET;
        const managerChannelToken = process.env.MANAGER_CHANNEL_TOKEN;

        if(!(channelSecret && channelAccessToken)) {
            throw new Error("Token not found!");
        };

        if (!(managerChannelSecret && managerChannelToken)) {
            throw new Error("Manager Secrets not found!")
        }

        this.channelToken = channelAccessToken;
        this.channelSecret = channelSecret;
        this.managerChannelSecret = managerChannelSecret;
        this.managerChannelToken = managerChannelToken;
    }

    public get userChannelConfig() {
        return {
            channelSecret: this.channelSecret,
            channelAccessToken: this.channelToken
        }
    }

    public get hostChannelConfig() {
        return {
            channelSecret: this.managerChannelSecret,
            channelAccessToken: this.managerChannelToken
        }
    }

    public static create(): Settings {
        return new Settings();
    }
}
