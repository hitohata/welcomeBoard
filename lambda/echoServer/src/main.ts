import * as line from "@line/bot-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";

export const lambdaHandler = async  (event: APIGatewayProxyEvent) => {

    console.log(event);

}
