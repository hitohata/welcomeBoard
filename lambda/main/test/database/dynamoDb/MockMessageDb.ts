import { IDateTime, IEasterEgg, IIMage, ILocationInfo, IMessage, IMessageDb, IProfile, IVideo } from "database/dynamoDb/IMessageDb";

interface IMockMessage {
    Key: string,
    Name: string
    Message: string
}

interface IMockEasterMessage {
    Key: string,
    Targets: string[],
    Message: string
}

export class MockMessageDb implements IMessageDb {
    public activeUserName: string[] = [];
    public imageUri: string = "default";
    public videoUri: string = "default";
    public message: IMockMessage[] = [{ Key: "key", Name: "name", Message: "message" }];
    public easterMessage: IMockEasterMessage[] = [{ Key: "key", Targets: ["default"], Message: "easter" }, { Key: "wild", Targets: [], Message: "wild" }];

    async putActiveUserName(userNames: string[]): Promise<void> {
        this.activeUserName = [...this.activeUserName, ...userNames];
    };

    async getActiveUserNames(): Promise<string[]> {
        return this.activeUserName;
    }

    async getLocation(): Promise<ILocationInfo> {
        return {
            Address: "address",
            LocationName: "LocationName",
            Latitude: 42,
            Longitude: 42
        }
    };

    async getWaddingDate(): Promise<IDateTime> {
        return { Date: new Date(1984, 4, 4, 0, 0, 0) };
    }

    async getMessage(keyword: string): Promise<IMessage | undefined> {
        const findMessage = this.message.find(el => el.Key === keyword);

        if (findMessage) {
            return {
                Keyword: findMessage.Key,
                Name: findMessage.Name,
                Message: findMessage.Message
            }
        }

        return undefined;
    };

    async getEasterEgg(keyword: string): Promise<IEasterEgg | undefined> {
        const findMessage = this.easterMessage.find(el => el.Key === keyword);

        if (findMessage) {
            return {
                Keyword: findMessage.Key,
                TargetUsers: findMessage.Targets,
                Message: findMessage.Message
            }
        }

        return undefined
    };

    async getBrideProfile(): Promise<IProfile> {
        return { Profile: "profile" };
    }

    async getGroomProfile(): Promise<IProfile> {
        return { Profile: "profile" };
    }

    async putImageUri(uri: string): Promise<void> {
        this.imageUri = uri;
    }

    async putVideoUri(uri: string): Promise<void> {
        this.videoUri = uri;
    }

    async getImageUri(): Promise<IIMage> {
        return { Uri: this.imageUri };
    };

    async getVideoUri(): Promise<IVideo> {
        return { Uri: this.videoUri };
    }

}
