import { IDistribution } from "./IDistribution";

export class Distribution implements IDistribution {

    private readonly distribution: string;

    constructor() {
        this.distribution = `https://${process.env.DISTRIBUTION_ID!}`;
    }

    public getMenuUri(): string {
        return `${this.distribution}/information-folder/line-image/menu.jpg`
    };

    public getSeatingChartUrl(): string {
        return `${this.distribution}/information-folder/line-image/seating-chart.jpg`
    }
}
