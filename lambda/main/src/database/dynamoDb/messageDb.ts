import { DynamoDBClient, GetItemCommand, GetItemCommandInput, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { IDateTime, IEasterEgg, ILocationInfo, IMessage, IMessageDb, IProfile } from "./IMessageDb";

export class MessageDb implements IMessageDb {
    private readonly client: DynamoDBClient;
    private readonly tableName: string;

    private readonly kindInformation = "Information";
    private readonly kindMessage = "Message";
    private readonly easterEgg = "EasterEgg";
    private readonly systemInformation = "SystemInformation"

    constructor(){
        this.client = new DynamoDBClient({ region: process.env.REGION });
        this.tableName = process.env.TABLE_NAME!;
    };

    /**
     * putUserName
     */
    public async putActiveUserName(userNames: string[]): Promise<void> {
        const pkName = "ActiveUsers";

        const param: PutItemCommandInput = {
            TableName: this.tableName,
            Item: {
                "Keyword": { "S": pkName },
                "Kind": { "S": this.systemInformation },
                "ActiveUsers": { "L": userNames.map(user => ({ "S": user })) }
            }
        }

        const putItemCommand = new PutItemCommand(param);

        await this.client.send(putItemCommand);

    }

    public async getActiveUserNames(): Promise<string[]> {
        const pkName = "ActiveUsers";

        const param: GetItemCommandInput = {
            TableName: this.tableName,
            Key: {
                "Keyword": { "S": pkName },
                "Kind": { "S": this.systemInformation }
            }
        }

        const getItemCommand = new GetItemCommand(param)

        const getResult = await this.client.send(getItemCommand);

        if (!getResult.Item) {
            return []
        };

        const item = unmarshall(getResult.Item);

        return item.ActiveUsers

    }

    public async getLocation(): Promise<ILocationInfo> {

        const pkName = "WeddingChapelLocation";

        const param: GetItemCommandInput = {
            TableName: this.tableName,
            Key: {
                "Keyword": { "S": pkName },
                "Kind": { "S": this.kindInformation }
            }
        };

        const getItemCommand = new GetItemCommand(param);

        const dynamoOutPut = await this.client.send(getItemCommand);

        if (!dynamoOutPut.Item) {
            throw new Error("fetching location information failed.");
        };

        const item = unmarshall(dynamoOutPut.Item);

        const locationInfo: ILocationInfo = {
            Address: item.Address,
            LocationName: item.LocationName,
            Latitude: item.Latitude,
            Longitude: item.Longitude
        };

        return locationInfo;

    }

    public async getWaddingDate(): Promise<IDateTime> {

        const pkName = "WeddingSchedule";

        const param: GetItemCommandInput = {
            TableName: this.tableName,
            Key: {
                "Keyword": { "S": pkName },
                "Kind": { "S" : this.kindInformation },
            }
        };

        const getItemCommand = new GetItemCommand(param);
        const dynamoOutPut = await this.client.send(getItemCommand);

        if (!dynamoOutPut.Item) {
            throw new Error("fetching wedding date failed.");
        };

        const item = unmarshall(dynamoOutPut.Item);

        const dateTime: IDateTime = {
            Date: item.Date
        };

        return dateTime

    }

    public async getMessage(keyword: string): Promise<IMessage | undefined> {

        const param: GetItemCommandInput = {
            TableName: this.tableName,
            Key: {
                "Keyword": { "S": keyword },
                "Kind": { "S": this.kindMessage }
            }
        }

        const getItemCommand = new GetItemCommand(param);
        const dynamoOutPut = await this.client.send(getItemCommand);

        if (!dynamoOutPut.Item) {
            return undefined;
        };

        const item = unmarshall(dynamoOutPut.Item);

        const message: IMessage = {
            Keyword: item.Keyword,
            Name: item.Name,
            Message: item.Message
        };

        return message;
    };

    public async getEasterEgg(keyword: string): Promise<IEasterEgg | undefined> {
        const param: GetItemCommandInput = {
            TableName: this.tableName,
            Key: {
                "Keyword": { "S": keyword },
                "Kind": { "S": this.easterEgg }
            }
        };

        const getItemCommand = new GetItemCommand(param);
        const dynamoOutput = await this.client.send(getItemCommand);

        if (!dynamoOutput.Item) {
            return undefined;
        };

        const item = unmarshall(dynamoOutput.Item);

        const message: IEasterEgg = {
            Keyword: item.Keyword,
            TargetUsers: item.TargetUsers,
            Message: item.Message
        };

        return message;
    }

    public async getBrideProfile(): Promise<IProfile> {
        const param: GetItemCommandInput = {
            TableName: this.tableName,
            Key: {
                "Keyword": { "S": "BrideProfile" },
                "Kind": { "S": "Profile" }
            }
        };

        const getCommand = new GetItemCommand(param);
        const brideProfile = await this.client.send(getCommand);

        if (!brideProfile.Item) {
            throw new Error("Bride profile is not found.");
        }

        const item = unmarshall(brideProfile.Item);

        return {
            Profile: item.Profile
        };

    };

    public async getGroomProfile(): Promise<IProfile> {
        const param: GetItemCommandInput = {
            TableName: this.tableName,
            Key: {
                "Keyword": { "S": "GroomProfile" },
                "Kind": { "S": "Profile" }
            }
        };

        const getCommand = new GetItemCommand(param);
        const groomProfile = await this.client.send(getCommand);

        if (!groomProfile.Item) {
            throw new Error("Bride profile is not found.");
        }

        const item = unmarshall(groomProfile.Item);

        return {
            Profile: item.Profile
        };

    };
}
