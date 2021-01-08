import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { ServerError } from '../errors/server-error';
import { UserAccount } from '../models/user-account';
import { StudentAccount } from '../models/student-account';


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

export const authorizeAndExtractUserToken = async (req: Request, res: Response, next: () => void) => {
    if (!req.headers.authorization) {
        res.status(403).send('Authorization header is missing');
    }
    const token = req.headers.authorization.split("Bearer ")[1];

    req.user = await verifyAndDecodeData(token) as UserAccount;

    next();
};

const encodeBase64 = (value: string): string => {  
    return Buffer.from(value, 'utf8').toString('base64'); 
}

const decodeBase64 = (value: string): string => {  
    return Buffer.from(value, 'base64').toString('utf8'); 
}

export const authorizeAndExtractStudentToken = async (req: Request, res: Response, next: () => void) => {
    if (!req.headers.authorization) {
        res.status(403).send('Authorization header is missing');
    }
    const token = req.headers.authorization.split("Student ")[1];

    req.user = JSON.parse(decodeBase64(token)) as StudentAccount;

    next();
};