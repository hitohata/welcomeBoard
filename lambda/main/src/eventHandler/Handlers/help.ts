import { LocationMessage, Message, PostbackEvent, TemplateMessage, TextMessage } from "@line/bot-sdk";
import { MessageDb } from "database/messageDb";

export class Helper {
    private readonly location = "location";
    private readonly dateTime = "dateTime";

    public helperTemplate(): TemplateMessage {
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
                        data: this.location,
                    },
                    {
                        type: "postback",
                        label: "DateTime",
                        data: this.dateTime
                    }
                ]
            }
        }
        return helperTemplate;
    };

    public async helpMessage(event: PostbackEvent): Promise<Message> {
        const postbackData = event.postback.data;

        if (postbackData === this.location) {
            const messageDbClient = new MessageDb();
            const locationData = await messageDbClient.getLocation();
            const location: LocationMessage = {
                type: "location",
                title: locationData.LocationName,
                address: locationData.Address,
                latitude: locationData.Latitude,
                longitude: locationData.Longitude
            };

            return location;
        };

        if (postbackData === this.dateTime) {
            const dateTime = new Date().toDateString();
            const dateTimeMessage: TextMessage = {
                type: "text",
                text: dateTime
            }
            return dateTimeMessage;
        }

        throw new Error("undefined postback event!");
    }
}
