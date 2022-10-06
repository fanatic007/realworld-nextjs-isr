// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User, UserResponse } from '../../types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUser, updateUser } from '../../prisma/user';
import { apiHandler, filterObectByType } from '../../helpers/api-handler';

export default apiHandler(handler);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  switch (req.method) {
    case 'GET': {
      const user: User = await getUser({token:req.headers.authorization?.replace('Bearer ','')}) as User;
      if(!user)
        throw new Error("Invalid Token. No user")
      const userResponse = filterObectByType<UserResponse>(user) as UserResponse;
      return res.status(200).json(userResponse);
    }
    case 'PUT': {
      const user: User = await getUser({token:req.headers.authorization?.replace('Bearer ','')}) as User;
      updateUser(user,req.body.user);
      const userResponse = filterObectByType<UserResponse>(user) as UserResponse;
      return res.status(200).json(userResponse);    
    }
    default: {
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
}