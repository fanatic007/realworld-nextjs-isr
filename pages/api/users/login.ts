
import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { getUser, updateUser } from '../../../db/user';
import { apiHandler } from '../../../helpers/api-handler';
import { generateToken } from '../../../helpers/jwt-middleware';
import { getResponse } from '../../../helpers/type-helpers';
import { UserPayload, UserRequest, UserResponse } from '../../../types';

export default apiHandler(handler);

const { serverRuntimeConfig } = getConfig();

async function  handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>) {
    switch (req.method) {
      case 'POST':
        return await authenticate(req.body.user);
      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    async function authenticate({email}: UserRequest) {
      const user= await getUser({email},{id:true,username:true});
      if (!user) 
        throw 'Username or password is incorrect';
      const token = generateToken(user.username);
      const updatedUser: UserPayload = await updateUser({ id: user.id },{token:token});
      const userResponse = getResponse<UserResponse>(updatedUser,'user') as UserResponse;
      return res.status(200).json(userResponse);
    }
}