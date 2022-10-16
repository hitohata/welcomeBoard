import { WebhookRequestBody } from "@line/bot-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import { HostLineClient, UserLineClient } from "eventHandler/lineClients";
import { Handler } from "eventHandler/handler";
import { handlersFactory } from "eventHandler/handlers/handlers";
import { MessageDb } from "database/messageDb";

export const lambdaHandler = async  (event: APIGatewayProxyEvent) => {

    const lineSignature: string = event.headers['x-line-signature']!;

    const lineClient = new UserLineClient(lineSignature, event.body);

    const hostClient = new HostLineClient();

    const handlers = handlersFactory(new MessageDb());

    const handler = new Handler(
        lineClient, 
        hostClient, 
        handlers.helperHandler, 
        handlers.profileHandler, 
        handlers.textMessageHandler
    );

    const body: WebhookRequestBody = JSON.parse(event.body!);
    await Promise.all(body.events.map(el => handler.checkEvent(el)));

    return {
        statusCode: 200,
        body: null
    }
}
