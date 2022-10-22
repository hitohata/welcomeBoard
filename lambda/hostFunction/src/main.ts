import { APIGatewayProxyEvent } from "aws-lambda";
import { UserLineClient, HostLineClient } from "./lineClients";
import { WebhookRequestBody } from "@line/bot-sdk";

export const lambdaHandler = async (event: APIGatewayProxyEvent) => {

    const lineSignature: string = event.headers['x-line-signature']!;
    const hostLineClient = new HostLineClient(lineSignature, event.body);

    try {

        const userLineClient = new UserLineClient();

        const body: WebhookRequestBody = JSON.parse(event.body!);

        // broadcast to clients.
        const eventFromHost = body.events[0]
        if (eventFromHost.type === "message" && eventFromHost.message.type === "text") {
            console.log("message text", eventFromHost.message.text);
            await userLineClient.broadcast({
                type: "text",
                text: eventFromHost.message.text,
            });
        }

        return {
            statusCode: 200,
            body: null
        }

    } catch (error) {

        console.error(error);

        if (error instanceof Error) {
            await hostLineClient.broadcast({
                type: "text",
                text: error.message
            });
        }

        await hostLineClient.broadcast({
            type: "text",
            text: `Unexpected error occurred./n ${error}`
        })

        return {
            statusCode: 400,
            body: null
        }
    }

}
