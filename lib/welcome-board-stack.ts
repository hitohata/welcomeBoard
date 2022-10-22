import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as path from "path";
import * as nodeLambda from "aws-cdk-lib/aws-lambda-nodejs";

interface IProps extends StackProps {
  stageSuffix: string
  tableArn: string
  channelSecret: string
  channelToken: string,
  managerChannelSecret: string,
  managerChannelToken: string
}

export class WelcomeBoardStack extends Stack {
  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id, props);

    const { stageSuffix, tableArn, channelSecret, channelToken, managerChannelSecret, managerChannelToken } = props;

    const messageTable = dynamodb.Table.fromTableArn(this, "messageTable", tableArn);

    const imageContentsBucket = new s3.Bucket(this, "imageContentBucket", {
      bucketName: `wedding-image-bucket${stageSuffix}`,
    });

    const messageFunction = new nodeLambda.NodejsFunction(
      this,
      "welcomeMessageFunction",
      {
        functionName: `welcomeMessageFunction${stageSuffix}`,
        entry: path.join(__dirname, "../lambda/main/src/main.ts"),
        handler: "lambdaHandler",
        timeout: Duration.seconds(10),
        environment: {
          CHANNEL_SECRET: channelSecret,
          CHANNEL_TOKEN: channelToken,
          MANAGER_CHANNEL_SECRET: managerChannelSecret,
          MANAGER_CHANNEL_TOKEN: managerChannelToken,
          TABLE_NAME: messageTable.tableName,
          REGION: this.region,
          IMAGE_BUCKET_NAME: imageContentsBucket.bucketName
        }
      },
    );

    const hostMessageFunction = new nodeLambda.NodejsFunction(
      this,
      "hostMessageFunction",
      {
        functionName: `hostMessageFunction${stageSuffix}`,
        entry: path.join(__dirname, "../lambda/hostFunction/src/main.ts"),
        handler: "lambdaHandler",
        timeout: Duration.seconds(10),
        environment: {
          CHANNEL_SECRET: channelSecret,
          CHANNEL_TOKEN: channelToken,
          MANAGER_CHANNEL_SECRET: managerChannelSecret,
          MANAGER_CHANNEL_TOKEN: managerChannelToken,
        }
      }
    );

    messageTable.grantReadData(messageFunction);
    imageContentsBucket.grantReadWrite(messageFunction);

    const api = new apiGateway.RestApi(this, "lineWebhookApi");

    const gestApi = api.root.addResource("gest");
    const gestFunctionIntegration = new apiGateway.LambdaIntegration(messageFunction);
    gestApi.addMethod("POST", gestFunctionIntegration);

    const hostLineWebHook = api.root.addResource("host");
    const hostLineFunctionIntegration = new apiGateway.LambdaIntegration(hostMessageFunction);
    hostLineWebHook.addMethod("POST", hostLineFunctionIntegration);

  }
}
