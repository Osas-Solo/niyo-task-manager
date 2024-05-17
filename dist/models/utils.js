"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPasswordValid = exports.isEmailAddressValid = exports.isNameValid = exports.generateHash = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function generateHash(data) {
    const crypto = require('node:crypto');
    const hash = crypto.createHash('sha256');
    const salt = process.env.SALT;
    const hashedData = hash.update((data + salt), 'utf-8');
    return hashedData.digest('hex');
}
exports.generateHash = generateHash;
function isNameValid(name) {
    return /^[a-zA-Z]+$/.test(name) && name.length >= 1 && name.length <= 100;
}
exports.isNameValid = isNameValid;
function isEmailAddressValid(emailAddress) {
    return /^[A-Za-z0-9+_.-]+@(.+\..+)$/.test(emailAddress);
}
exports.isEmailAddressValid = isEmailAddressValid;
function isPasswordValid(password) {
    return /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) &&
        password.length >= 8 && password.length <= 20;
}
exports.isPasswordValid = isPasswordValid;
