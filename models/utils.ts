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

function isPasswordValid(password: string) {
    return /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) &&
        password.length >= 8 && password.length <= 20;
}

function isTitleValid(title: string): boolean {
    return /./.test(title) && title.length >= 1 && title.length <= 100;
}

export {generateHash, isNameValid, isEmailAddressValid, isPasswordValid, isTitleValid};
