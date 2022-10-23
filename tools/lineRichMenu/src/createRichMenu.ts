import { Client } from "@line/bot-sdk";
import { richMenuObjectA } from "./richMenu/richMenu";
import { join } from "path";
import { readFileSync } from "fs";

const main = async () => {
    try {
        const lineClient = new Client({
            channelSecret: process.env.CHANNEL_SECRET!,
            channelAccessToken: process.env.CHANNEL_TOKEN!
        });

        const richMenuAId = await lineClient.createRichMenu(
            richMenuObjectA()
        )

        const filepathA = join(__dirname, './richmenu-template-guide-01.png')
        const bufferA = readFileSync(filepathA)

        await lineClient.setRichMenuImage(richMenuAId, bufferA);
        await lineClient.setDefaultRichMenu(richMenuAId);
        console.log("success");
    } catch(error) {
        console.error('%o', error);
    }
}

main()
