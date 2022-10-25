import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as path from "path";

interface IProps extends StackProps {
    deployStageSuffix: string
}

export class WelcomeBoardManagerStack extends Stack {

    private readonly welcomeMessageTableArn: string;
    private readonly deployStageSuffix: string;

    constructor(scope: Construct, id: string, props: IProps) {
        super(scope, id, props);

        const { deployStageSuffix } = props;

        this.deployStageSuffix = deployStageSuffix;

        // table
        const welcomeMessageTable = new dynamodb.Table(this, "welcomeMessageTable", {
            tableName: `WelcomeMessageTable${deployStageSuffix}`,
            partitionKey: {
                name: "Keyword",
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: "Kind",
                type: dynamodb.AttributeType.STRING
            },
            removalPolicy: RemovalPolicy.DESTROY
        });

        welcomeMessageTable.addLocalSecondaryIndex({
            indexName: "Kind_index",
            sortKey: {
                name: "Kind",
                type: dynamodb.AttributeType.STRING
            },
        });

        this.welcomeMessageTableArn = welcomeMessageTable.tableArn;

        this.appSyncSetting(welcomeMessageTable.tableArn);

    }

    private appSyncSetting(tableArn: string) {
        const userPool = new cognito.UserPool(this, "welcomeMessageManagementUser", {
            userPoolName: `WelcomeMessageManagementUsers${this.deployStageSuffix}`,
            removalPolicy: RemovalPolicy.DESTROY
        });
        userPool.addClient("WeddingSync");

        const appSyncApi = new appsync.GraphqlApi(this, "AppSyncApi", {
            name: `welcomeMessageTableApi${this.deployStageSuffix}`,
            schema: appsync.Schema.fromAsset(path.join(__dirname, "../graphql/schema.graphql")),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.USER_POOL,
                    userPoolConfig: {
                        userPool: userPool
                    },
                }
            },
        });

        const welcomeMessageTable = dynamodb.Table.fromTableArn(this, "messageTable", tableArn);

        const dynamoDS = appSyncApi.addDynamoDbDataSource("dynamoDS", welcomeMessageTable);

        dynamoDS.createResolver({
            typeName: "Query",
            fieldName: "getMessage",
            requestMappingTemplate: appsync.MappingTemplate.dynamoDbGetItem("Keyword", "Keyword"),
            responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
        });

        dynamoDS.createResolver({
            typeName: "Query",
            fieldName: "listMessages",
            requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
            responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList()
        });

        dynamoDS.createResolver({
            typeName: "Mutation",
            fieldName: "addMessage",
            requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
                appsync.PrimaryKey.partition("Keyword").is("input.Keyword"),
                appsync.Values.projecting("input")
            ),
            responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
        });

        dynamoDS.createResolver({
            typeName: "Mutation",
            fieldName: "deleteMessage",
            requestMappingTemplate: appsync.MappingTemplate.dynamoDbDeleteItem("Keyword", "Keyword"),
            responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
        });
    }

    public tableArn(): string {
        return this.welcomeMessageTableArn;
    }
}
