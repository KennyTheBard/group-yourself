import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { ServerError } from '../errors/server-error';
import { User } from '../models/user';


export const generateToken = async (payload: object) => {
    try {
        const signed = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET_KEY);
        return signed;
    } catch (err) {
        console.trace(err);
        throw new ServerError("Failed to sign the encoded token", 500);
    }
};

const verifyAndDecodeData = async (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decoded;
    } catch (err) {
        console.trace(err);
        throw new ServerError("Failed to decode the token", 400);
    }
};

export const authorizeAndExtractToken = async (req: Request, res: Response, next: () => void) => {
    if (!req.headers.authorization) {
        res.status(403).send('Authorization header is missing');
    }
    const token = req.headers.authorization.split(" ")[1];

    req.user = await verifyAndDecodeData(token) as User;

    next();
};