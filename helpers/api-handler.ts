import { errorHandler } from './error-handler';
import { jwtMiddleware } from './jwt-middleware';
import type { NextApiRequest, NextApiResponse } from 'next';
import { UserPayload } from '../types';
export { apiHandler };

function apiHandler(handler: Function) {
  return async (
    req:NextApiRequest, res:NextApiResponse
    ) => {
      try {
        await jwtMiddleware(req, res);
        await handler(req, res);
      } 
      catch (err:unknown) {
        errorHandler(<Error>err, res);
      }
    }
}