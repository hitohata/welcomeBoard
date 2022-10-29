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

export interface IEasterEgg {
    Keyword: string,
    TargetUsers: string[],
    Message: string
}

export interface IProfile {
    Profile: string
}

export interface IActiveUser {
    UserName: string
}

export interface IMessageDb {
    putActiveUserName(userNames: string[]): Promise<void>
    getActiveUserNames(): Promise<string[]>
    getLocation(): Promise<ILocationInfo>
    getWaddingDate(): Promise<IDateTime>
    getMessage(keyword: string): Promise<IMessage | undefined>
    getEasterEgg(keyword: string): Promise<IEasterEgg | undefined>
    getBrideProfile(): Promise<IProfile>
    getGroomProfile(): Promise<IProfile>
};
