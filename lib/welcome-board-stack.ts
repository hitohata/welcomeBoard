import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambdaGo from "@aws-cdk/aws-lambda-go-alpha";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as path from "path";

interface IProps extends StackProps {
  stageSuffix: string
  tableArn: string
  channelSecret: string
  channelToken: string
}

export class WelcomeBoardStack extends Stack {
  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id, props);

    const { stageSuffix, tableArn, channelSecret, channelToken } = props;

    const messageTable = dynamodb.Table.fromTableArn(this, "messageTable", tableArn);

    const messageFunction = new lambdaGo.GoFunction(
      this,
      "welcomeMessageFunction",
      {
        functionName: `welcomeMessageFunction${stageSuffix}`,
        // entry: path.join(__dirname, "../lambda/welcomeBoard/src/handler.go"),
        entry: path.join(__dirname, "../lambda/echoServer/main.go"),
        timeout: Duration.seconds(10),
        bundling: {
          environment: {
            CHANNEL_SECRET: channelSecret,
            CHANNEL_TOKEN: channelToken
          }
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
