import crypto from "crypto";
const KEY = (process.env.AUTH_SECRET || "dev_secret").slice(0,32);
const IV = Buffer.alloc(16, 0);
export function encrypt(text: string) {
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(KEY), IV);
  let enc = cipher.update(text, "utf8", "base64");
  enc += cipher.final("base64");
  return enc;
}
export function decrypt(b64: string) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(KEY), IV);
  let dec = decipher.update(b64, "base64", "utf8");
  dec += decipher.final("utf8");
  return dec;
}
