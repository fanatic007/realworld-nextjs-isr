import type { NextApiRequest, NextApiResponse } from 'next';
import { errorHandler } from './error-handler';
import { jwtMiddleware } from './jwt-middleware';
export { apiHandler };

function apiHandler(handler: Function) {
  return async (
    req:NextApiRequest, res:NextApiResponse
    ) => {
      try {
        await jwtMiddleware(req, res);
        const token = (req.headers.authorization as string)?.replace('Bearer ','');
        await handler(req, res, token);
      } 
      catch (err:unknown) {
        errorHandler(<Error>err, res);
      }
    }
}