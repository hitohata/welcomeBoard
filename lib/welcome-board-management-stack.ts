import { Duration, RemovalPolicy, Resource, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as nodeLambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as appsync from "@aws-cdk/aws-appsync-alpha";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";
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

        welcomeMessageTable.addGlobalSecondaryIndex({
            indexName: "KindIndex",
            partitionKey: {
                name: "Kind",
                type: dynamodb.AttributeType.STRING
            },
            sortKey: {
                name: "Keyword",
                type: dynamodb.AttributeType.STRING
            }
        })

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

        const resolverFunction = new nodeLambda.NodejsFunction(this, "ResolverFunction", {
            functionName: `messageDbResolverFunction${this.deployStageSuffix}`,
            entry: path.join(__dirname, "../lambda/resolverFunction/src/index.ts"),
            handler: "lambdaHandler",
            timeout: Duration.seconds(10),
            environment: {
                REGION: this.region,
                TABLE_NAME: welcomeMessageTable.tableName
            }
        })

        resolverFunction.role?.addToPrincipalPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ["dynamodb:*"],
            resources: [
                `${welcomeMessageTable.tableArn}/*`
            ]
        }))

        welcomeMessageTable.grantFullAccess(resolverFunction);

        const dynamoDS = appSyncApi.addDynamoDbDataSource("dynamoDS", welcomeMessageTable);
        const lambdaDs = appSyncApi.addLambdaDataSource("lambdaResolver", resolverFunction);

        dynamoDS.createResolver({
            typeName: "Query",
            fieldName: "getMessage",
            requestMappingTemplate: this.getDynamoResolver("Keyword", "Kind"),
            responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
        });

        dynamoDS.createResolver({
            typeName: "Query",
            fieldName: "getActiveUsers",
            requestMappingTemplate: this.getDynamoResolver("Keyword", "Kind"),
            responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
        });

        dynamoDS.createResolver({
            typeName: "Query",
            fieldName: "getEasterEgg",
            requestMappingTemplate: this.getDynamoResolver("Keyword", "Kind"),
            responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
        });

        lambdaDs.createResolver({
            typeName: "Query",
            fieldName: "listMessages",
        });

        lambdaDs.createResolver({
            typeName: "Query",
            fieldName: "listEasterEggs"
        })

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
            fieldName: "addEasterEgg",
            requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
                appsync.PrimaryKey.partition("Keyword").is("input.Keyword"),
                appsync.Values.projecting("input")
            ),
            responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem()
        });

        lambdaDs.createResolver({
            typeName: "Mutation",
            fieldName: "deleteMessage",
        });

        lambdaDs.createResolver({
            typeName: "Mutation",
            fieldName: "deleteEasterEgg",
        });
    }

    public tableArn(): string {
        return this.welcomeMessageTableArn;
    }

    private getDynamoResolver(partitionKey: string, sortKey: string): appsync.MappingTemplate {
			return appsync.MappingTemplate.fromString(
				`{
                "version": "2017-02-28",
                "operation": "GetItem",
                "key": {
                  "${partitionKey}": $util.dynamodb.toDynamoDBJson(
                    $ctx.args.${partitionKey}
                  ),
                  "${sortKey}": $util.dynamodb.toDynamoDBJson(
                    $ctx.args.${sortKey}
                  )
                }
            }`,
		);
	};
}
