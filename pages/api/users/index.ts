// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { USER_DEFAULT } from '../../../constants';
import { addUser, getUser } from '../../../db/user';
import { apiHandler } from '../../../helpers/api-handler';
import { getResponse } from '../../../helpers/type-helpers';
import { UserPayload, UserRequest, UserResponse } from '../../../types/index';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  switch (req.method) {
    case 'POST': {
      const regData: UserRequest = req.body.user;
      if(await getUser({username:regData.username}))
        throw new Error("User already exists");      
      const newUserData: Prisma.UserCreateInput  = {...regData, ...USER_DEFAULT} as Prisma.UserCreateInput;
      const newUser: UserPayload = (await addUser(newUserData)) as UserPayload;
      const userResponse = getResponse<UserResponse>(newUser,'user') as UserResponse;
      return res.status(200).json(userResponse);
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
}