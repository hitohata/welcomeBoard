export interface IProfileImageUrl {
    mainImageUrl: string,
    thumbnailImageUrl: string
}

export interface IDistribution {
    getMenuUri(): string,
    getSeatingChartUrl(): string,
    getGroomImages(): IProfileImageUrl,
    getBrideImages(): IProfileImageUrl
    userContentUri(bucketPrefix: string): string
}
