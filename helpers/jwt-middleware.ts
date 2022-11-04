var { expressjwt: expressjwt } = require("express-jwt");
const util = require('util');
const jwt = require('jsonwebtoken');
import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
export { jwtMiddleware, generateToken, getJWTPayload };

const { serverRuntimeConfig } = getConfig();
function jwtMiddleware(req:NextApiRequest, res:NextApiResponse<any>) {
    const middleware = expressjwt({ secret: serverRuntimeConfig.secret, algorithms: ['HS256']}).unless({
        path: [
            '/api/users',
            '/api/users/login',
            '/api/tags'
        ]
    });
    return util.promisify(middleware)(req, res);
}

function generateToken(id:string,username:string): string {
    return jwt.sign({ id, username }, serverRuntimeConfig.secret, { expiresIn: '600s' });    
}

function getJWTPayload(token:String) {    
    return jwt.verify(token, serverRuntimeConfig.secret);
}