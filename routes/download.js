import { Router } from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import { encode } from "../lib/crypto.js";
import { USER_AGENT } from "../lib/constants.js";
import { success, fail } from "../lib/response.js";

const router = Router();

router.get("/download", async (req, res) => {
    try {
        const url = req.query.url;

        if (!url) {
            return res.status(400).json(fail("Missing query parameter: url"));
        }

        const response = await axios.get(url, {
            headers: {
                "User-Agent": USER_AGENT,
                Referer: "https://www.tiktok.com/",
            },
        });

        const $ = cheerio.load(response.data);
        const universalData = $("#__UNIVERSAL_DATA_FOR_REHYDRATION__").html();

        if (!universalData) {
            return res.status(404).json(fail("TikTok data not found."));
        }

        const json = JSON.parse(universalData);
        const item =
            json?.__DEFAULT_SCOPE__?.["webapp.video-detail"]?.itemInfo
                ?.itemStruct;

        if (!item) {
            return res.status(404).json(fail("Video information not found."));
        }

        const urlStream = item.video?.PlayAddrStruct?.UrlList?.[2] || "";
        const tokenLink = encodeURIComponent(encode(urlStream));

        // Delete unnecessary properties from the item object
        delete item.video.bitrateInfo;
        delete item.video.zoomCover;
        delete item.video.challenges;
        delete item.video.playAddr;
        delete item.video.downloadAddr;
        delete item.video.originCover;
        delete item.video.cover;

        return res.json(
            success({
                ...item,
                stream_url: `/api/watch?url=${tokenLink}`,
            })
        );
    } catch (err) {
        console.error(err);
        return res.status(500).json(fail(err.message || "Internal Server Error"));
    }
});

export default router;