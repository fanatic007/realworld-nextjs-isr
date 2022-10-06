// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { addUser } from '../../../prisma/user';
import { apiHandler } from '../../../helpers/api-handler';
import { getUser } from '../../../prisma/user';
import { UserRequest, UserResponse } from '../../../types';
import { USER_DEFAULT } from '../../../constants';
import { Prisma } from '@prisma/client';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  switch (req.method) {
    case 'POST': {
      const regData: UserRequest = req.body.user;
      if(await getUser({email:regData.email}))
        throw new Error("User already exists");      
      const newUserData: Prisma.UserCreateInput  = {...regData, ...USER_DEFAULT} as Prisma.UserCreateInput;
      const newUser: UserResponse = (await addUser(newUserData)) as UserResponse;
      return res.status(200).json(newUser);
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
}