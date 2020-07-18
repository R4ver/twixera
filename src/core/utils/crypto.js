import { getCurrentUser } from "Core/utils/mixer";
import crypto from "crypto";

class Crypto {
    constructor() {
        this.happyThoughts = `${process.env.ENCRYPT_SECRET}${getCurrentUser().id}`;
        this.resizedIV = Buffer.allocUnsafe(16);
    }

    encrypt(data) {
        const key = crypto
            .createHash("sha256")
            .update(this.happyThoughts)
            .digest(),
            cipher = crypto.createCipheriv("aes256", key, this.resizedIV),
            output = [];

        output.push(cipher.update(data, "binary", "hex"));
        output.push(cipher.final("hex"));
        return output.join("");
    }

    decrypt(data) {
        const key = crypto
            .createHash("sha256")
            .update(this.happyThoughts)
            .digest(),
            decipher = crypto.createDecipheriv("aes256", key, this.resizedIV),
            output = [];

        output.push(decipher.update(data, "hex", "binary"));
        output.push(decipher.final("binary"));
        return output.join("")
    }

    getAccessToken() {
        let access_token;

        try {
            access_token = this.decrypt(localStorage.getItem("__mixera_auth"));
        } catch (error) {
            access_token = null;
        }
        console.log()
        return access_token;
    }

    isAuthed() {
        return (this.getAccessToken() !== null && this.getAccessToken() !== undefined);
    }
}

export default Crypto;