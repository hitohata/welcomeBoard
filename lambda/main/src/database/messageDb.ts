import { DynamoDBClient, GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";
import { IDateTime, ILocationInfo, IMessage, IMessageDb } from "./IMessageDb";

const kindInformation = "Information";
const kindMessage = "Message";

export class MessageDb implements IMessageDb {
    private readonly client: DynamoDBClient;
    private readonly tableName: string;
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
                "Kind": { "S": kindInformation }
            }
        };

        const getItemCommand = new GetItemCommand(param); 

        const dynamoOutPut = await this.client.send(getItemCommand);

        if (!dynamoOutPut.Item) {
            // TODO: update
            throw new Error("get item error");
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
                "Kind": { "S" : kindInformation },
            }
        };

        const getItemCommand = new GetItemCommand(param);
        const dynamoOutPut = await this.client.send(getItemCommand);

        if (!dynamoOutPut.Item) {
            // TODO: update
            throw new Error("error");
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
                "Kind": { "S": kindMessage }
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
    }

}
