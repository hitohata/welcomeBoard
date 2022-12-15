import { IDistribution, IProfileImageUrl } from "database/distribution/IDistribution";

export class MockDistribution implements IDistribution {
    getMenuUri(): string {
        return "menu";
    }
    getSeatingChartUrl(): string {
        return "seatingChart";
    }
    getGroomImages(): IProfileImageUrl {
        return {
            mainImageUrl: "mainImage",
            thumbnailImageUrl: "thumbNail"
        }
    }
    getBrideImages(): IProfileImageUrl {
        return {
            mainImageUrl: "mainImage",
            thumbnailImageUrl: "thumbNail"
        }
    }
    userContentUri(bucketPrefix: string): string {
        return `host/${bucketPrefix}`;
    }
}
