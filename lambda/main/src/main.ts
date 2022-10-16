import { Client, WebhookRequestBody, validateSignature, LocationMessage, TemplateMessage } from "@line/bot-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Settings } from "settings/settings";
import { HostLineClient, UserLineClient } from "eventHandler/lineClients";
import { Handler } from "eventHandler/handler";

export const lambdaHandler = async  (event: APIGatewayProxyEvent) => {

    const lineSignature: string = event.headers['x-line-signature']!;

    const lineClient = new UserLineClient(lineSignature, event.body);

    const hostClient = new HostLineClient();

    const body: WebhookRequestBody = JSON.parse(event.body!);

    const handler = new Handler(lineClient, hostClient);

    await Promise.all(body.events.map(el => handler.checkEvent(el)));

    return {
        statusCode: 200,
        body: null
    }

    // if (lineEvent.type === "postback") {
    //     const postBackData = lineEvent.postback.data;
    //     const token = lineEvent.replyToken;
    //     if (postBackData === "location") {
    //         const location: LocationMessage = {
    //             type: "location",
    //             title: "dummy",
    //             address: "here",
    //             latitude: 4.671551542536234,
    //             longitude: -160.37976231284628
    //         };
    //         await lineClient.replyMessage(token, [location]);
    //     }
    //     if (postBackData === "datetime") {
    //         const dataTime = new Date().toString();
    //         await lineClient.replyMessage(token, {type: "text", text: dataTime});
    //     }
    // }

    // if (lineEvent.type === "message" && lineEvent.message.type === "text") {



    //     const replyToken = lineEvent.replyToken;

    //     const input = lineEvent.message.text;

    //     if (input === "help") {
    //         const helperTemplate: TemplateMessage = {
    //             type: "template",
    //             altText: "May I help you?",
    //             template: {
    //                 type: "buttons",
    //                 title: "Help!!",
    //                 text: "Help!!!!",
    //                 actions: [
    //                     {
    //                         type: "postback",
    //                         label: "Location",
    //                         data: "location",
    //                     },
    //                     {
    //                         type: "postback",
    //                         label: "DateTime",
    //                         data: "datetime",
    //                     }
    //                 ]
    //             }
    //         }
    //         await lineClient.replyMessage(replyToken, helperTemplate)
    //     } else {

    //         const userId = lineEvent.source.userId!;
    //         const userName = (await lineClient.getProfile(userId)).displayName;

    //         await Promise.all([
    //             lineClient.replyMessage(replyToken, [{
    //                 type: "text",
    //                 text: input,
    //             }]),
    //             managerClient.broadcast({
    //                 type: "text",
    //                 text: `${userName} < ${input}`,
    //             }),
	// 	    ])
    //     };

    // }

    // return {
    //     statusCode: 200,
    //     body: null
    // }
}
