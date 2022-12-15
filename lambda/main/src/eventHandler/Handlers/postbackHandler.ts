import { ImageMessage, LocationMessage, Message, PostbackEvent, TextMessage } from "@line/bot-sdk";
import { IDistribution } from "database/distribution/IDistribution";
import { IMessageDb } from "database/dynamoDb/IMessageDb";

export interface IPostBackHandler {
    postbackEventHandler(event: PostbackEvent): Promise<Message | Message[]>
}

export class PostBackHandler implements IPostBackHandler {
    private readonly distribution: IDistribution;
    private readonly messageDb: IMessageDb;
    private readonly _menu = "menu"
    private readonly _seatingChart = "seatingChart"
    private readonly _location = "location";
    private readonly _dateTime = "dateTime";
    private readonly _groomProfile = "groomProfile";
    private readonly _brideProfile = "brideProfile";

    public constructor(messageDb: IMessageDb, distribution: IDistribution){
        this.distribution = distribution;
        this.messageDb = messageDb;
    };

    public async postbackEventHandler(event: PostbackEvent): Promise<Message | Message[]> {
        const postBackData = event.postback.data;

        if (postBackData === this._menu) {
            return this.menuImageMessage();
        }

        if (postBackData === this._seatingChart) {
            return this.seatingChartImageMessage();
        }

        if (postBackData === this._location) {
            return await this.locationInformation();
        }

        if (postBackData === this._dateTime) {
            return await this.dateTimeInformation();
        }

        if (postBackData === this._brideProfile) {
            return await this.getBrideProfileMessage();
        }

        if (postBackData === this._groomProfile) {
            return await this.getGroomProfileMessage();
        }

        return {
            type: "text",
            text: "this is an unexpected return."
        }
    }

    private menuImageMessage(): ImageMessage {
        const menuImageUrl = this.distribution.getMenuUri();

        return {
            type: "image",
            originalContentUrl: menuImageUrl,
            previewImageUrl: menuImageUrl
        };
    };

    public seatingChartImageMessage(): ImageMessage | Message {
        const seatingChartImageUrl = this.distribution.getSeatingChartUrl();

        return {
            type: "image",
            originalContentUrl: seatingChartImageUrl,
            previewImageUrl: seatingChartImageUrl
        }
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

    public async getGroomProfileMessage(): Promise<Message[]> {

        const groomImages = this.distribution.getGroomImages();
        const groomImageMessage: ImageMessage = {
            type: "image",
            originalContentUrl: groomImages.mainImageUrl,
            previewImageUrl: groomImages.thumbnailImageUrl
        }

        const groomProfile = await this.messageDb.getGroomProfile();
        const groomProfileMessage: TextMessage = {
            type: "text",
            text: groomProfile.Profile
        };

        return [groomImageMessage, groomProfileMessage]
    }

    public async getBrideProfileMessage(): Promise<Message[]> {

        const brideImage = this.distribution.getBrideImages();
        const brideImageMessage: ImageMessage = {
            type: "image",
            originalContentUrl: brideImage.mainImageUrl,
            previewImageUrl: brideImage.thumbnailImageUrl
        };

        const brideProfile = await this.messageDb.getBrideProfile();
        const profileMessage: TextMessage = {
            type: "text",
            text: brideProfile.Profile
        };

        return [brideImageMessage, profileMessage];
    }
};

const weddingDateDetail = (weddingDateTime: Date): string => {

    const receptionDateTime = `受付: ${toDateTimeString(weddingDateTime)}`; 

    const weddingCeremonyDate = new Date(weddingDateTime.setTime(weddingDateTime.getTime() + (30 * 60 * 1000)));
    const weddingCeremony = `挙式: ${toDateTimeString(weddingCeremonyDate)}`;

    const weddingBanquetDateTime = new Date(weddingCeremonyDate.setTime(weddingCeremonyDate.getTime() + (40 * 60 * 1000)))
    const weddingBanquet = `披露宴: ${toDateTimeString(weddingBanquetDateTime)}`

    return [receptionDateTime, weddingCeremony, weddingBanquet].join("\n");
}

const timeDiff = (weddingDateTime: Date, now: Date): string => {

    const diff_msec = weddingDateTime.getTime() - now.getTime()

    if (diff_msec < 0) {
        return "Started"
    };

    const days = Math.floor(diff_msec / (60 * 24 * 60 * 1000));

    return `${days} days left.`

}

const toDateTimeString = (dateTime: Date): string => {
    return `${dateTime.getFullYear()}/${dateTime.getMonth() + 1}/${dateTime.getDate()} ${String(dateTime.getHours()).padStart(2, "0")}:${String(dateTime.getMinutes()).padStart(2, "0")}:${String(dateTime.getSeconds()).padStart(2, "0")}`
}
