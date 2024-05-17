import dotenv from 'dotenv';

dotenv.config();

function generateHash(data: string): string {
    const crypto = require('node:crypto');
    const hash = crypto.createHash('sha256');
    const salt: string = process.env.SALT as string;

    const hashedData = hash.update((data + salt), 'utf-8');

    return hashedData.digest('hex');
}

export {generateHash};
