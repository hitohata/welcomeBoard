import { DynamoDBClient, GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";
import { ILocationInfo, IMessageDb } from "./IMessageDb";

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
            Key: { "Keyword": { "S": pkName } }
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

}
