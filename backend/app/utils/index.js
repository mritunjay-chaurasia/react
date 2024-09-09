// Function to encrypt data
// exports.encrypt = (text) => {
//     if(!isEncrypted(text)) {
//         const encrypted = `${Buffer.from(text).toString('base64')}_/^encptd^/`;
//         return encrypted;
//     } else return text
// }

// // Function to decrypt data
// exports.decrypt = (encryptedText) => {
//     if(encryptedText && isEncrypted(encryptedText)) return Buffer.from(encryptedText.split('_/^encptd^/')[0], 'base64').toString('ascii')
//     else encryptedText
// }

// const isEncrypted = (stringData) => {
//     return (stringData && stringData.includes("_/^encptd^/"));
// };

// utils/crypto.js
const crypto = require('crypto');

function encrypt(text) {
    if(!isEncrypted(text)) {
        // Create an AES cipher object with the secret key and ECB mode
        const cipher = crypto.createCipheriv('aes-256-ecb', Buffer.from(process.env.USER_DATA_ENCRYPTION_KEY), null);
        // Encrypt the plaintext
        let encryptedText = cipher.update(text, 'utf-8', 'hex');
        encryptedText += cipher.final('hex');
        return `${encryptedText}_/^encptd^/`;;
    } else return text
}

function decrypt(text) {
    if (text && isEncrypted(text)) {
        // Decrypt the ciphertext
        const decipher = crypto.createDecipheriv('aes-256-ecb', Buffer.from(process.env.USER_DATA_ENCRYPTION_KEY), null);
        // Decrypt the encrypted text
        let decryptedText = decipher.update(text.split('_/^encptd^/')[0], 'hex', 'utf-8');
        decryptedText += decipher.final('utf-8');
        return decryptedText;
    } else return text
}

const isEncrypted = (stringData) => {
    return (stringData && stringData.includes("_/^encptd^/"));
};


module.exports = { encrypt, decrypt };
