export interface ILocationInfo {
    Address: string,
    LocationName: string,
    Latitude: number,
    Longitude: number,
}

export interface IDateTime {
    Date: Date,
}

export interface IMessage {
    Keyword: string,
    Name: string,
    Message: string
}

export interface IMessageDb {
    getLocation(): Promise<ILocationInfo>
    // getWaddingDate(): Promise<IDateTime>
    // getMessage(): Promise<IMessage | undefined>
};
