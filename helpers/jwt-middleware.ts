var { expressjwt: jwt } = require("express-jwt");
const util = require('util');
import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
export { jwtMiddleware };

const { serverRuntimeConfig } = getConfig();
function jwtMiddleware(req:NextApiRequest, res:NextApiResponse<any>) {;
    const middleware = jwt({ secret: serverRuntimeConfig.secret, algorithms: ['HS256'] }).unless({
        path: [
            '/api/users',
            '/api/users/login',
            '/api/tags'
        ]
    });

    return util.promisify(middleware)(req, res);
}