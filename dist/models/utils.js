"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHash = void 0;
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
