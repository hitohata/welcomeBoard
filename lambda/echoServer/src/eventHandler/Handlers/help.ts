import { LocationMessage, Message, PostbackEvent, TemplateMessage, TextMessage } from "@line/bot-sdk";

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

    public helpMessage(event: PostbackEvent): Message {
        const postbackData = event.postback.data;

        if (postbackData === this.location) {
            const location: LocationMessage = {
                type: "location",
                title: "dummy",
                address: "here",
                latitude: 4.671551542536234,
                longitude: -160.37976231284628
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
