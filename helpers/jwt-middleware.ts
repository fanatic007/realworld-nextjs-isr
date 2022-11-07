var { expressjwt: expressjwt } = require("express-jwt");
const util = require('util');
const jwt = require('jsonwebtoken');
import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { EXPIRY_TIME } from '../constants';
export { jwtMiddleware, generateToken, getJWTPayload };

const { serverRuntimeConfig } = getConfig();
function jwtMiddleware(req:NextApiRequest, res:NextApiResponse<any>) {
    const middleware = expressjwt({ secret: serverRuntimeConfig.secret, algorithms: ['HS256']}).unless({
        path: [
            /^\/api\/users/,
            /^\/api\/users\/login/,
            /^\/api\/tags/,
            /^\/api\/articles/,
            /^\/api\/profiles\/([a-z0-9-_]+)$/
        ]
    });
    return util.promisify(middleware)(req, res);
}

function generateToken(id:string,username:string): string {
    return jwt.sign({ userID:id, username }, serverRuntimeConfig.secret, { expiresIn: EXPIRY_TIME });    
}

function getJWTPayload(token:String) {    
    return jwt.verify(token, serverRuntimeConfig.secret);
}