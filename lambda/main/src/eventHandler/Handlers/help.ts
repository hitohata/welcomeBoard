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

            const locationMessage: LocationMessage = {
                type: "location",
                title: locationData.LocationName,
                address: locationData.Address,
                latitude: locationData.Latitude,
                longitude: locationData.Longitude
            };

            return locationMessage;
        };

        if (postbackData === this.dateTime) {

            // wedding date time
            const messageDbClient = new MessageDb();
            const dateTimeData = await messageDbClient.getWaddingDate();
            const weddingDateTime = new Date(dateTimeData.Date);

            // current date time
            const dateTime = new Date;
            const timeOffset = 9 * 60 * 60 * 1000;
            const jstDateTime = new Date(dateTime.setTime(dateTime.getTime() + timeOffset));

            const dateTimeMessage: TextMessage = {
                type: "text",
                text: weddingDateDetail(weddingDateTime) + "\n" + timeDiff(weddingDateTime, jstDateTime)
            }
            return dateTimeMessage;
        }

        throw new Error("undefined postback event!");
    }
}

const weddingDateDetail = (weddingDateTime: Date): string => {

    const receptionDateTime = `Reception: ${toDateTimeString(weddingDateTime)}`; 

    const weddingCeremonyDate = new Date(weddingDateTime.setTime(weddingDateTime.getTime() + (30 * 60 * 1000)));
    const weddingCeremony = `Wedding Ceremony: ${toDateTimeString(weddingCeremonyDate)}`;

    const weddingBanquetDateTime = new Date(weddingCeremonyDate.setTime(weddingCeremonyDate.getTime() + (40 * 60 * 1000)))
    const weddingBanquet = `Wedding Banquet: ${toDateTimeString(weddingBanquetDateTime)}`

    return [receptionDateTime, weddingCeremony, weddingBanquet].join("\n");
}

const timeDiff = (weddingDateTime: Date, now: Date): string => {

    console.log(weddingDateTime, now);

    const diff_msec = weddingDateTime.getTime() - now.getTime()

    console.log("diff", diff_msec)

    if (diff_msec < 0) {
        return "Started"
    };

    const days = Math.floor(diff_msec / (60 * 24 * 60 * 100));

    return `${days} days left.`

}

const toDateTimeString = (dateTime: Date): string => {
    console.log(dateTime);
    return `${dateTime.getFullYear()}/${dateTime.getMonth() + 1}/${dateTime.getDate()} ${String(dateTime.getHours()).padStart(2, "0")}:${String(dateTime.getMinutes()).padStart(2, "0")}:${String(dateTime.getSeconds()).padStart(2, "0")}`
}
