import { Client, WebhookRequestBody, validateSignature } from "@line/bot-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Settings } from "settings/settings";



export const lambdaHandler = async  (event: APIGatewayProxyEvent) => {

    const settings = Settings.create();
    const userSettings = settings.userChannelConfig;

    const lineClient = new Client({
        channelAccessToken: userSettings.channelToken,
        channelSecret: userSettings.channelSecret
    });

    const lineSignature: string = event.headers['x-line-signature']!; 

    if (!(validateSignature(event.body!, userSettings.channelSecret, lineSignature))) {
        throw new Error("In valid signature");
    }

    const body: WebhookRequestBody = JSON.parse(event.body!);

    const lineEvent = body.events[0];
    

    // lineClient.replyMessage({

    // })

    return {
        statusCode: 200,
        body: JSON.stringify({
            status: "hoge",
            message: "fuga"
        })
    }
}
