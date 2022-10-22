import { WebhookRequestBody } from "@line/bot-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import { HostLineClient, UserLineClient } from "eventHandler/lineClients";
import { Handler } from "eventHandler/handler";
import { handlersFactory } from "eventHandler/Handlers/handlers";
import { MessageDb } from "database/dynamoDb/messageDb";
import { richMenuObjectA } from "./richMenu/richMenu";
import * as fs from "fs";
import { join } from "path";

export const lambdaHandler = async  (event: APIGatewayProxyEvent) => {

    const lineSignature: string = event.headers['x-line-signature']!;

    const lineClient = new UserLineClient(lineSignature, event.body);

    const hostClient = new HostLineClient();

    const handlers = handlersFactory(new MessageDb(), lineClient);

    // const richMenu = await lineClient.createRichMenu(richMenuObjectA())
    // const filePath = join(__dirname, "./16984988403378.png");
    // const buffer = fs.readFileSync(filePath);

    // await lineClient.setRichMenuImage(filePath, buffer);
    // await lineClient.setDefaultRichMenu(richMenu);

    const handler = new Handler(
        lineClient,
        hostClient,
        handlers.helperHandler,
        handlers.profileHandler,
        handlers.textMessageHandler,
        handlers.imageHandler
    );

    const body: WebhookRequestBody = JSON.parse(event.body!);

    body.events.map(el => {
        console.log(el);
    })

    try {
        await Promise.all(body.events.map(el => handler.checkEvent(el)));
    } catch (error) {
        if (error instanceof Error) {
            hostClient.broadcast({
                type: "text",
                text: error.message
            });
        }

        hostClient.broadcast({
            type: "text",
            text: `Unexpected error occurred./n ${error}`
        })
        
    }


    return {
        statusCode: 200,
        body: null
    }
}
