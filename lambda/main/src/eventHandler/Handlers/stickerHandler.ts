import { StickerMessage } from "@line/bot-sdk";

export interface IStickerHandler {
    getPositiveStickerMessage(): StickerMessage,
    getNegativeStickerMessage(): StickerMessage
}

export class StickerHandler implements IStickerHandler {
    constructor() {}

    getPositiveStickerMessage(): StickerMessage {
        const positiveStickerId = this.selectPositiveSticker();
        return {
            type: "sticker",
            packageId: positiveStickerId.packageId,
            stickerId: positiveStickerId.stickerId
        }
    };

    getNegativeStickerMessage(): StickerMessage {
        const negativeStickerId = this.selectNegativeSticker();
        return {
            type: "sticker",
            packageId: negativeStickerId.packageId,
            stickerId: negativeStickerId.stickerId
        }
    }

    private selectPositiveSticker(): IStickerId {
        const positiveStickers: [string, string][]= [
            ["446", "1991"],
            ["446", "1992"],
            ["446", "1995"],
            ["446", "1998"],
            ["446", "1999"],
            ["446", "2002"],
            ["446", "2003"],
            ["789", "10856"],
            ["789", "10857"],
            ["789", "10858"],
            ["789", "10859"],
            ["789", "10864"],
            ["789", "10866"],
            ["789", "10867"],
            ["789", "10869"],
            ["789", "10871"],
            ["789", "10873"],
            ["789", "10874"],
            ["789", "10875"],
            ["789", "10875"],
            ["11537", "52002734"],
            ["11537", "52002735"],
            ["11537", "52002736"],
            ["11537", "52002738"],
        ];

        const seed = Math.floor(Math.random() * positiveStickers.length);
        const selectedSticker = positiveStickers[seed]

        return {
            packageId: selectedSticker[0],
            stickerId: selectedSticker[1]
        }

    };

    private selectNegativeSticker(): IStickerId {
        const negativeStickers: [string, string][]= [
            ["446", "1999"],
            ["446", "2004"],
            ["446", "2005"],
            ["446", "2006"],
            ["446", "2007"],
            ["446", "2008"],
            ["446", "2013"],
            ["446", "2016"],
            ["446", "2017"],
            ["446", "2018"],
            ["446", "2019"],
            ["446", "2020"],
            ["446", "2022"],
            ["446", "2023"],
            ["446", "2026"],
            ["789", "10860"],
            ["789", "10877"],
            ["789", "10878"],
            ["789", "10879"],
            ["789", "10880"],
            ["789", "10881"],
            ["789", "10882"],
            ["789", "10883"],
            ["789", "10884"],
            ["789", "10885"],
            ["789", "10887"],
            ["789", "10890"],
            ["789", "10894"],
            ["6325", "10979917"],
            ["6325", "10979921"],
            ["6325", "10979922"],
            ["11537", "52002744"],
            ["11537", "52002746"],
            ["11537", "52002750"],
            ["11537", "52002751"],
            ["11537", "52002753"],
            ["11537", "52002754"],
            ["11537", "52002755"],
            ["11537", "52002758"],
            ["11537", "52002760"],
            ["11537", "52002761"],
            ["11537", "52002763"],
            ["11537", "52002765"],
            ["11537", "52002770"],
            ["11537", "52002771"],
        ];

        const seed = Math.floor(Math.random() * negativeStickers.length);
        const selectedSticker = negativeStickers[seed]

        return {
            packageId: selectedSticker[0],
            stickerId: selectedSticker[1]
        }

    }
}

interface IStickerId {
    packageId: string,
    stickerId: string
}
