import { IDistribution, IProfileImageUrl } from "./IDistribution";

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
    public getGroomImages(): IProfileImageUrl {
       return {
            mainImageUrl: `${this.distribution}/information-folder/profiles/groom-content.jpg`,
            thumbnailImageUrl: `${this.distribution}/information-folder/profiles/groom-preview.jpg`
       }
    };

    /**
     * same as above
     * @returns [image url, thumbnail url]
     */
    public getBrideImages(): IProfileImageUrl {
       return {
            mainImageUrl: `${this.distribution}/information-folder/profiles/bride-content.jpg`,
            thumbnailImageUrl: `${this.distribution}/information-folder/profiles/bride-preview.jpg`
       }
    };

    /**
     * add the distribution host to the bucket prefix.
     * @param bucketPrefix 
     * @returns 
     */
    public userContentUri(bucketPrefix: string): string {
        return `${this.distribution}/${bucketPrefix}`;
    }
}
