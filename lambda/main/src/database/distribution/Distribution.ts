import { IDistribution } from "./IDistribution";

class Distribution implements IDistribution {

    private readonly distribution: string;

    constructor() {
        this.distribution = `https://${process.env.DISTRIBUTION_ID!}`;
    }

    public getMenuUri(): string {
        return `${this.distribution}/information/menu.jpg`
    };
}
