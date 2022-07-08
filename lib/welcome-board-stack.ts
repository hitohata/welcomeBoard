import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambdaGo from "@aws-cdk/aws-lambda-go-alpha";
import * as path from "path";
import { table } from 'console';

interface IProps extends StackProps {
  deployStage: string
}

export class WelcomeBoardStack extends Stack {
  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id, props);

    const { deployStage } = props;

    const messageTable = new dynamodb.Table(this, "welcomeMessageTable", {
      tableName: `WelcomeBoardTable${deployStage}`,
      partitionKey: { name: "gestName", type: dynamodb.AttributeType.STRING },
    });

    const messageFunction = new lambdaGo.GoFunction(
      this,
      "welcomeMessageFunction",
      {
        functionName: `welcomeMessageFunction${deployStage}`,
        entry: path.join(__dirname, "../lambda/welcomeBoard/main.go"),
      },
    );

    messageTable.grantFullAccess(messageFunction);
  }
}
