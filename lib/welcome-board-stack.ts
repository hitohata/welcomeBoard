import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
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
          MANAGER_CHANNEL_TOKEN: managerChannelToken
        }
      },
    );

    messageTable.grantReadData(messageFunction);

    const api = new apiGateway.LambdaRestApi(this, "apiGateway", {
      restApiName: `WelcomeMessageAPI${stageSuffix}`,
      handler: messageFunction,
      proxy: false
    });

    const lineWebHook = api.root.addResource("callback");

    lineWebHook.addMethod("POST");

  }
}
