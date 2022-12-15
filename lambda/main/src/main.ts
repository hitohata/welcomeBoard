import { WebhookRequestBody } from "@line/bot-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Handler } from "eventHandler/handler";
import { handlersFactory } from "eventHandler/Handlers/handlers";
import { ILineUserClient, ILineHostClient } from "lineClient/ILineClient";
import { UserLineClient, HostLineClient } from "lineClient/LineClient";

export const lambdaHandler = async  (event: APIGatewayProxyEvent) => {

    console.log(event);

    const lineSignature: string = event.headers['x-line-signature']!;

    const lineClient: ILineUserClient = new UserLineClient(lineSignature, event.body);

    const hostClient: ILineHostClient = new HostLineClient();

<<<<<<< HEAD
    const handlers = handlersFactory(new MessageDb(), lineClient);
=======
    const handlers = handlersFactory(lineClient);
>>>>>>> 99c5871f73bc511df2d940b03a9d149fcf13f9af

    const handler = new Handler(
        lineClient,
        hostClient,
        handlers.textMessageHandler,
        handlers.imageHandler,
        handlers.videoHandler,
        handlers.informationHandler,
        handlers.stickerHandler,
        handlers.followEventHandler
    );

    const body: WebhookRequestBody = JSON.parse(event.body!);

    try {
        await Promise.all(body.events.map(el => handler.checkEvent(el)));
    } catch (error) {

        if (body.events[0].type === "message" && body.events[0].replyToken) {
            return lineClient.replyMessage(body.events[0].replyToken, {
                type: "text",
                text: "Error"
            });
        }

        console.error(error);

        if (error instanceof Error) {
            await hostClient.broadcast({
                type: "text",
                text: error.message
            });
        }

        await hostClient.broadcast({
            type: "text",
            text: `Unexpected error occurred./n ${error}`
        })
    }


    return {
        statusCode: 200,
        body: null
    }
}
