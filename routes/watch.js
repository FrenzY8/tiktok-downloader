import { Router } from "express";
import axios from "axios";
import { decode } from "../lib/crypto.js";
import { USER_AGENT } from "../lib/constants.js";
import { success, fail } from "../lib/response.js";

const router = Router();

router.get("/watch", async (req, res) => {
    try {
        const tokenParam = req.query.url;

        if (!tokenParam) {
            return res.status(400).json(fail("Missing query parameter: url"));
        }

        const token = decodeURIComponent(String(tokenParam));
        const url = decode(token);

        const response = await axios({
            method: "GET",
            url,
            responseType: "stream",
            headers: {
                "User-Agent": USER_AGENT,
                Referer: "https://www.tiktok.com/",
            },
            validateStatus: () => true,
        });

        if (response.status >= 400) {
            return res.status(response.status).json(fail("Unable to fetch video."));
        }

        const contentType =
            response.headers["content-type"] || "video/mp4";

        res.setHeader("Content-Type", contentType);
        res.status(response.status);

        response.data.pipe(res);
    } catch (err) {
        console.error(err);
        return res.status(500).json(fail(err.message || "Internal Server Error"));
    }
});

export default router;