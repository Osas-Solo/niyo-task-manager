"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearToken = exports.retrieveToken = exports.authenticateToken = exports.saveToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jwt = require('jsonwebtoken');
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY;
function saveToken(response, user) {
    const token = jwt.sign({ userID: user.id, }, secretKey, { expiresIn: '30 days' });
    const numberOfMilliSecondsInADay = 24 * 60 * 60 * 1000;
    response.cookie('token', token, { maxAge: (numberOfMilliSecondsInADay * 30) + Date.now() });
    response.cookie('userID', user.id, { maxAge: (numberOfMilliSecondsInADay * 30) + Date.now() });
}
exports.saveToken = saveToken;
function authenticateToken(token, userID) {
    if (!token) {
        return false;
    }
    try {
        const decodedToken = jwt.verify(token, secretKey);
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decodedToken.userID === userID && currentTimestamp <= decodedToken.exp) {
            return true;
        }
    }
    catch (e) {
        return false;
    }
    return false;
}
exports.authenticateToken = authenticateToken;
function retrieveToken(request) {
    const token = request.cookies.token;
    let userID = Number(request.cookies.userID);
    if (isNaN(userID)) {
        userID = 0;
    }
    return { token, userID };
}
exports.retrieveToken = retrieveToken;
function clearToken(response) {
    response.clearCookie('token');
    response.clearCookie('userID');
}
exports.clearToken = clearToken;
