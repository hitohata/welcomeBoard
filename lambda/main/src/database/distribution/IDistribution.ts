export interface IDistribution {
    getMenuUri(): string,
    getSeatingChartUrl(): string,
    getGroomImages(): [string, string],
    getBrideImages(): [string, string]
}
