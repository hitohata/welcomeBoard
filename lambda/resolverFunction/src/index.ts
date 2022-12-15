import { AppSyncResolverEvent } from "aws-lambda";
import { QueryCommandInput, QueryCommand, DynamoDBClient, DeleteItemCommandInput, GetItemCommandInput, GetItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb"
import { tableName, region } from "./settings";
import { table } from "console";

export const lambdaHandler = async (event: AppSyncResolverEvent<any>) => {

    const resolver = event.info.fieldName;
    const dynamoClient = new DynamoDBClient({ region: region });

    if (resolver === "listMessages") {
        const queryCommandInput: QueryCommandInput = {
            TableName: tableName,
            IndexName: "KindIndex",
            KeyConditionExpression: "Kind = :Kind",
            ExpressionAttributeValues: {
                ":Kind": { S: "Message" }
            },
        }

        const command = new QueryCommand(queryCommandInput);

        const result = await dynamoClient.send(command);

        if (!result.Items) {
            return [];
        };

        const items = result.Items.map(item => unmarshall(item));

        return items.map(item => ({
            Keyword: item.Keyword,
            Kind: item.Kind,
            Name: item.Name,
            Message: item.Message
        }))

    };

    if (resolver === "listEasterEggs") {
        const queryCommandInput: QueryCommandInput = {
            TableName: tableName,
            IndexName: "KindIndex",
            KeyConditionExpression: "Kind = :Kind",
            ExpressionAttributeValues: {
                ":Kind": { S: "EasterEgg" }
            },
        };

        const command = new QueryCommand(queryCommandInput);

        const result = await dynamoClient.send(command);

        if (!result.Items) {
            return [];
        };

        const items = result.Items.map(item => unmarshall(item));

        return items.map(item => ({
            Keyword: item.Keyword,
            Kind: item.Kind,
            TargetUsers: item.TargetUsers,
            Message: item.Message
        }))
    };

    if (resolver === "deleteMessage") {

        const getParam: GetItemCommandInput = {
            TableName: tableName,
            Key: {
                "Keyword": { "S": event.arguments.Keyword },
                "Kind": { "S": "Message" }
            }
        };

        const getCommand = new GetItemCommand(getParam);

        const result = await dynamoClient.send(getCommand);

        if (!result.Item) {
            return null
        }

        const getItem = unmarshall(result.Item);

        const deleteCommandInput: DeleteItemCommandInput = {
            TableName: process.env.TABLE_NAME!,
            Key: {
                "Keyword": { "S": event.arguments.Keyword },
                "Kind": { "S": "Message" }
            }
        };

        const deleteCommand = new DeleteItemCommand(deleteCommandInput);

        await dynamoClient.send(deleteCommand);

        return getItem;
    };

    if (resolver === "deleteEasterEgg") {

        const getParam: GetItemCommandInput = {
            TableName: tableName,
            Key: {
                "Keyword": { "S": event.arguments.Keyword },
                "Kind": { "S": "EasterEgg" }
            }
        };

        const getCommand = new GetItemCommand(getParam);

        const result = await dynamoClient.send(getCommand);

        if (!result.Item) {
            return null
        }

        const getItem = unmarshall(result.Item);

        const deleteCommandInput: DeleteItemCommandInput = {
            TableName: process.env.TABLE_NAME!,
            Key: {
                "Keyword": { "S": event.arguments.Keyword },
                "Kind": { "S": "EasterEgg" }
            }
        };

        const deleteCommand = new DeleteItemCommand(deleteCommandInput);

        await dynamoClient.send(deleteCommand);

        return getItem;
    }
    throw new Error("No resolver");

}
