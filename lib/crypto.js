export function encode(text) {
    return Buffer.from(text, "utf-8").toString("base64");
}

export function decode(encodedText) {
    return Buffer.from(encodedText, "base64").toString("utf-8");
}