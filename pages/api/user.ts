// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { UserPayload, UserResponse } from '../../types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUser, updateUser } from '../../db/user';
import { apiHandler } from '../../helpers/api-handler';
import { userResponseFields, getResponse } from '../../constants';

export default apiHandler(handler);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  switch (req.method) {
    case 'GET': {   
      const userPayload: UserPayload = await getUser({token:req.headers.authorization?.replace('Bearer ','')}, userResponseFields);
      if(!userPayload)
        throw new Error("Invalid Token. No user")
      const userResponse = getResponse<UserResponse>(userPayload,'user') as UserResponse;
      return res.status(200).json(userResponse);
    }
    case 'PUT': {
      const user = await getUser({token:req.headers.authorization?.replace('Bearer ','')}, {id:true});
      if(!user)
        throw new Error("Invalid Token. No user")
      const userPayload: UserPayload = await updateUser({id:user['id']},req.body.user);
      const userResponse = getResponse<UserResponse>(userPayload,'user') as UserResponse;
      return res.status(200).json(userResponse);
    }
    default: {
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
}