import { Client, WebhookRequestBody, validateSignature, LocationMessage, TemplateMessage } from "@line/bot-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Settings } from "settings/settings";



export const lambdaHandler = async  (event: APIGatewayProxyEvent) => {

    const settings = Settings.create();
    const userSettings = settings.userChannelConfig;
    const managerSetting = settings.managerChannelConfig;

    const lineClient = new Client({
        channelAccessToken: userSettings.channelAccessToken,
        channelSecret: userSettings.channelSecret
    });

    const managerClient = new Client({
        channelAccessToken: managerSetting.channelAccessToken,
        channelSecret: managerSetting.channelSecret
    })

    const lineSignature: string = event.headers['x-line-signature']!;

    if (!(validateSignature(event.body!, userSettings.channelSecret, lineSignature))) {
        throw new Error("In valid signature");
    }

    const body: WebhookRequestBody = JSON.parse(event.body!);

    const lineEvent = body.events[0];

    if (lineEvent.type === "postback") {
        const postBackData = lineEvent.postback.data;
        const token = lineEvent.replyToken;
        if (postBackData === "location") {
            const location: LocationMessage = {
                type: "location",
                title: "dummy",
                address: "here",
                latitude: 4.671551542536234,
                longitude: -160.37976231284628
            };
            await lineClient.replyMessage(token, [location]);
        }
        if (postBackData === "datetime") {
            const dataTime = new Date().toString();
            await lineClient.replyMessage(token, {type: "text", text: dataTime});
        }
    }

    if (lineEvent.type === "message" && lineEvent.message.type === "text") {



        const replyToken = lineEvent.replyToken;

        const input = lineEvent.message.text;

        if (input === "help") {
            const helperTemplate: TemplateMessage = {
                type: "template",
                altText: "May I help you?",
                template: {
                    type: "buttons",
                    title: "Help!!",
                    text: "Help!!!!",
                    actions: [
                        {
                            type: "postback",
                            label: "Location",
                            data: "location",
                        },
                        {
                            type: "postback",
                            label: "DateTime",
                            data: "datetime",
                        }
                    ]
                }
            }
            await lineClient.replyMessage(replyToken, helperTemplate)
        } else {

            const userId = lineEvent.source.userId!;
            const userName = (await lineClient.getProfile(userId)).displayName;

            await Promise.all([
                lineClient.replyMessage(replyToken, [{
                    type: "text",
                    text: input,
                }]),
                managerClient.broadcast({
                    type: "text",
                    text: `${userName} < ${input}`,
                }),
		    ])
        };

    }

    return {
        statusCode: 200,
        body: null
    }
}
