import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambdaGo from "@aws-cdk/aws-lambda-go-alpha";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";

interface IProps extends StackProps {
  deployStage: string
  tableArn: string
}

export class WelcomeBoardStack extends Stack {
  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id, props);

    const { deployStage, tableArn } = props;

    const messageTable = dynamodb.Table.fromTableArn(this, "messageTable", tableArn);

    const messageFunction = new lambdaGo.GoFunction(
      this,
      "welcomeMessageFunction",
      {
        functionName: `welcomeMessageFunction${deployStage}`,
        entry: path.join(__dirname, "../lambda/welcomeBoard/src/handler.go"),
        runtime: lambda.Runtime.GO_1_X
      },
    );

    messageTable.grantReadData(messageFunction);

    const api = new apiGateway.RestApi(this, "apiGateway", {});
    const resource = api.root.addResource("v1");

    resource.addProxy({
      defaultIntegration: new apiGateway.LambdaIntegration(messageFunction),
      anyMethod: true
    })
  }
}
