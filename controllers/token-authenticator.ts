import {Request, Response} from 'express';
import dotenv from 'dotenv';
import User from '../models/User';

const jwt = require('jsonwebtoken');

dotenv.config();

const secretKey = process.env.SECRET_KEY;

function saveToken(response: Response, user: User) {
    const token = jwt.sign({userID: user.id,}, secretKey, {expiresIn: '30 days'});
    const numberOfMilliSecondsInADay = 24 * 60 * 60 * 1000;

    response.cookie('token', token, {maxAge: (numberOfMilliSecondsInADay * 30) + Date.now()});
    response.cookie('userID', user.id, {maxAge: (numberOfMilliSecondsInADay * 30) + Date.now()});
}

function authenticateToken(token: string, userID: number) {
    if (!token) {
        return false;
    }

    try {
        const decodedToken = jwt.verify(token, secretKey);
        const currentTimestamp = Math.floor(Date.now() / 1000);

        if (decodedToken.userID === userID && currentTimestamp <= decodedToken.exp) {
            return true;
        }
    } catch (e) {
        return false;
    }

    return false;
}

function retrieveToken(request: Request) {
    const token = request.cookies.token;
    let userID = Number(request.cookies.userID);

    if (isNaN(userID)) {
        userID = 0;
    }

    return {token, userID};
}

function clearToken(response: Response) {
    response.clearCookie('token');
    response.clearCookie('userID');
}

export {saveToken, authenticateToken, retrieveToken, clearToken};