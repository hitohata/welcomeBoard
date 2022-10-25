import { DynamoDBClient, GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";
import { IDateTime, ILocationInfo, IMessage, IMessageDb, IProfile } from "./IMessageDb";

export class MessageDb implements IMessageDb {
    private readonly client: DynamoDBClient;
    private readonly tableName: string;

    private readonly kindInformation = "Information";
    private readonly kindMessage = "Message";

    constructor(){
        this.client = new DynamoDBClient({ region: process.env.REGION });
        this.tableName = process.env.TABLE_NAME!;
    };

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
