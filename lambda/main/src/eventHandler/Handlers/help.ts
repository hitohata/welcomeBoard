import { LocationMessage, Message, TemplateMessage, TextMessage } from "@line/bot-sdk";
import { IMessageDb } from "database/IMessageDb";

export interface IHelperHandler {
    helperTemplate(): TemplateMessage
    locationInformation(): Promise<Message>,
    dateTimeInformation(): Promise<Message>,
    location: string,
    dateTime: string
}

export class HelperHandler {
    private readonly _location = "location";
    private readonly _dateTime = "dateTime";
    private readonly messageDb: IMessageDb;

    constructor(messageDb: IMessageDb) {
        this.messageDb = messageDb;
    };

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
                        data: this._location,
                    },
                    {
                        type: "postback",
                        label: "DateTime",
                        data: this._dateTime
                    }
                ]
            }
        }
        return helperTemplate;
    };

    public async locationInformation(): Promise<Message> {
        const locationData = await this.messageDb.getLocation();

        const locationMessage: LocationMessage = {
            type: "location",
            title: locationData.LocationName,
            address: locationData.Address,
            latitude: locationData.Latitude,
            longitude: locationData.Longitude
        };

        return locationMessage;
    }

    public async dateTimeInformation(): Promise<Message> {

        // wedding date time
        const dateTimeData = await this.messageDb.getWaddingDate();
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

    get location(): string {
        return this._location;
    }

    get dateTime(): string {
        return this._dateTime;
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
