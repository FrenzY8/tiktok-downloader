import crypto from 'node:crypto';

const SECRET_KEY = crypto.scryptSync("optionaluse", 'salt-unik', 32);
const ALGORITHM = 'aes-256-gcm';
const expireTimeInSeconds = 3600;

export function encode(text, ttlInSeconds = expireTimeInSeconds) {
    const expiresAt = Date.now() + (ttlInSeconds * 1000);
    
    const payload = JSON.stringify({
        data: text,
        exp: expiresAt
    });

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    
    let encrypted = cipher.update(payload, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const tag = cipher.getAuthTag();

    const combined = Buffer.concat([iv, tag, encrypted]);
    return combined.toString('base64url');
}

export function decode(encodedText) {
    try {
        const combined = Buffer.from(encodedText, 'base64url');
        
        if (combined.length < 28) {
            throw new Error();
        }

        const iv = combined.subarray(0, 12);
        const tag = combined.subarray(12, 28);
        const encrypted = combined.subarray(28);

        const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
        decipher.setAuthTag(tag);

        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        
        const payload = JSON.parse(decrypted.toString('utf8'));

        if (Date.now() > payload.exp) {
            throw new Error("Expired");
        }

        return payload.data;
    } catch {
        throw new Error("Invalid stream URL");
    }
}