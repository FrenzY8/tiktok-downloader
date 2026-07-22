import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const tiktokVideoUrl = "https://www.tiktok.com/@edsaaap/video/7500915127688891656";

const USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0.0.0 Safari/537.36";

(async () => {
    try {
        const { data: html } = await axios.get(tiktokVideoUrl, {
            headers: {
                "User-Agent": USER_AGENT,
                Referer: "https://www.tiktok.com/",
            },
        });

        const $ = cheerio.load(html);

        const universalData = $("#__UNIVERSAL_DATA_FOR_REHYDRATION__").html();

        if (!universalData) {
            throw new Error("TikTok metadata not found.");
        }

        const json = JSON.parse(universalData);

        const item =
            json?.__DEFAULT_SCOPE__?.["webapp.video-detail"]?.itemInfo
                ?.itemStruct;

        if (!item) {
            throw new Error("Video information not found.");
        }

        const streamUrl = item.video?.PlayAddrStruct?.UrlList?.[2];

        console.log("========== VIDEO ==========");
        console.log("Description :", item.desc);
        console.log("Author      :", item.author.uniqueId);
        console.log("Duration    :", item.video.duration);
        console.log("Views       :", item.stats.playCount);
        console.log("Likes       :", item.stats.diggCount);
        console.log();
        console.log("Stream URL:");
        console.log(streamUrl);

        const response = await axios({
            url: streamUrl,
            method: "GET",
            responseType: "stream",
            headers: {
                "User-Agent": USER_AGENT,
                Referer: "https://www.tiktok.com/",
            },
        });

        response.data.pipe(fs.createWriteStream(item.author.uniqueId+"_"+item.id+".mp4"));

        console.log("\nDownloading...");
    } catch (err) {
        console.error(err.message);
    }
})();