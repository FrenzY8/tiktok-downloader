# TikTok Downloader

A simple TikTok video downloader built with **Node.js** and **Express**.  
This project does **not** use any third-party TikTok API. It reads the video metadata directly from the TikTok page and provides a video stream endpoint.

## Features

- No third-party API
- Extract video metadata from TikTok
- Stream video through your own server
- Simple JSON response
- Built with Express, Axios, and Cheerio

## Installation

```bash
git clone https://github.com/frenzy8/tiktok-downloader.git
cd tiktok-downloader
npm install
```

## Run

```bash
npm test
```

Server will start at:

```
http://localhost:3000
```

---

## API Work

### 1. GET VIDEO METADATA

**Request**

```http
GET /api/download?url=https://www.tiktok.com/@username/video/123456789
```

**Example**

```bash
curl "http://localhost:3000/api/download?url=https://www.tiktok.com/@username/video/123456789"
```

**Response**

```json
{
  "success": true,
  "message": "success",
  "id": "...",
  "desc": "...",
  "author": {
    "nickname": "username"
  },
  "video": {},
  "stream_url": "/api/watch?url=TOKEN"
}
```

---

### 2. GET MP4 RESULT

Use the `stream_url` returned from `/api/download`.
![Preview](doc/stream_url.png "TikTok Downloader")

**Request**

```http
GET /api/watch?url=TOKEN
```

**Example**

```bash
curl -o video.mp4 "http://localhost:3000/api/watch?url=TOKEN"
```

This endpoint returns the video as an `mp4` stream.
![Preview](doc/stream_watch.png "TikTok Downloader")

---
