import dotenv from 'dotenv';

dotenv.config();

function generateHash(data: string): string {
    const crypto = require('node:crypto');
    const hash = crypto.createHash('sha256');
    const salt: string = process.env.SALT as string;

    const hashedData = hash.update((data + salt), 'utf-8');

    return hashedData.digest('hex');
}

function isNameValid(name: string): boolean {
    return /^[a-zA-Z]+$/.test(name) && name.length >= 1 && name.length <= 100;
}

function isEmailAddressValid(emailAddress: string): boolean {
    return /^[A-Za-z0-9+_.-]+@(.+\..+)$/.test(emailAddress);
}

export {generateHash, isNameValid, isEmailAddressValid};
