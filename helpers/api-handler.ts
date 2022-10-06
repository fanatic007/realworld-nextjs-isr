import { errorHandler } from './error-handler';
import { jwtMiddleware } from './jwt-middleware';
import type { NextApiRequest, NextApiResponse } from 'next';
import { UserResponse } from '../types';
export { apiHandler, filterObectByType };

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

function filterObectByType<T>(obj:any){
  return Object.keys(obj).
  filter((key) =>  obj[key as keyof UserResponse]).
  reduce((cur, key) => { return Object.assign(cur, { [key]: obj[key] })}, {});
}