// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { UserPayload, UserResponse } from '../../types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUser, updateUser } from '../../db/user';
import { apiHandler } from '../../helpers/api-handler';
import { USER_RESPONSE_FIELDS } from '../../constants';
import { getResponse } from '../../helpers/type-helpers';
import { getJWTPayload } from '../../helpers/jwt-middleware';

export default apiHandler(handler);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>,
  token:string
) {
  const {userID} = getJWTPayload(token);
  switch (req.method) {
    case 'GET': {   
      const USER_PAYLOAD: UserPayload = {token,...(await getUser({id:userID}, USER_RESPONSE_FIELDS))};
      const userResponse = getResponse<UserResponse>(USER_PAYLOAD,'user') as UserResponse;
      return res.status(200).json(userResponse);
    }
    case 'PUT': {
      const USER_PAYLOAD: UserPayload = {token,...(await updateUser({id:userID}, req.body.user))};
      const userResponse = getResponse<UserResponse>(USER_PAYLOAD,'user') as UserResponse;
      return res.status(200).json(userResponse);
    }
    default: {
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
}