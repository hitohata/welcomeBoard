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

<<<<<<< HEAD
=======
export interface IIMage {
    Uri: string
}

export interface IVideo {
    Uri: string
}

>>>>>>> 99c5871f73bc511df2d940b03a9d149fcf13f9af
export interface IMessageDb {
    putActiveUserName(userNames: string[]): Promise<void>
    getActiveUserNames(): Promise<string[]>
    getLocation(): Promise<ILocationInfo>
    getWaddingDate(): Promise<IDateTime>
    getMessage(keyword: string): Promise<IMessage | undefined>
    getEasterEgg(keyword: string): Promise<IEasterEgg | undefined>
    getBrideProfile(): Promise<IProfile>
    getGroomProfile(): Promise<IProfile>
    putImageUri(uri: string): Promise<void>
    putVideoUri(uri: string): Promise<void>
    getImageUri(): Promise<IIMage>
    getVideoUri(): Promise<IVideo>
};
