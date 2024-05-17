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

function isPasswordConfirmed(password: string, passwordConfirmer: string) {
    return password === passwordConfirmer;
}

function isTitleValid(title: string): boolean {
    return /./.test(title) && title.length >= 1 && title.length <= 100;
}

function isDescriptionValid(description: string): boolean {
    return /./.test(description);
}

function isTimeValid(time: string): boolean {
    return !isNaN((new Date(time)).valueOf());
}

function isStartTimeValid(startTime: string): boolean {
    const currentTime = new Date();
    const convertedStartTime = new Date(startTime);

    return isTimeValid(startTime) && (convertedStartTime.valueOf() >= currentTime.valueOf());
}

function isEndTimeValid(startTime: string, endTime: string): boolean {
    const convertedStartTime = new Date(startTime);
    const convertedEndTime = new Date(endTime);

    return isTimeValid(endTime) && (convertedEndTime.valueOf() > convertedStartTime.valueOf());
}

function isTaskCompletedValid(isCompleted: any): boolean {
    return typeof isCompleted === 'boolean';
}

export {generateHash, isNameValid, isEmailAddressValid, isPasswordValid, isPasswordConfirmed, isTitleValid, isDescriptionValid, isTimeValid, isStartTimeValid, isEndTimeValid, isTaskCompletedValid};
