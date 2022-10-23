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
    };

    /**
     * return groom's image and its thumbnail.
     * @returns [image url, thumbnail url]
     */
    public getGroomImages(): [string, string] {
       return [
            `${this.distribution}/information-folder/profiles/groom-content.jpg`,
            `${this.distribution}/information-folder/profiles/groom-preview.jpg`
       ]
    };

    /**
     * same as above
     * @returns [image url, thumbnail url]
     */
    public getBrideImages(): [string, string] {
       return [
            `${this.distribution}/information-folder/profiles/bride-content.jpg`,
            `${this.distribution}/information-folder/profiles/bride-preview.jpg`
       ]
    };
}
