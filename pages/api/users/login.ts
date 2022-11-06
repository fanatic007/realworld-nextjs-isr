
import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { userResponseFields } from '../../../constants';
import { getUser } from '../../../db/user';
import { apiHandler } from '../../../helpers/api-handler';
import { generateToken } from '../../../helpers/jwt-middleware';
import { getResponse } from '../../../helpers/type-helpers';
import { UserPayload, UserResponse } from '../../../types';

export default apiHandler(handler);

const { serverRuntimeConfig } = getConfig();

async function  handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>) {
    switch (req.method) {
      case 'POST':
        const { email, password } = req.body.user;
        const user = await getUser({email});
        if (!user || user.password != password )
          throw 'Username or password is incorrect';
        const token = generateToken(user.id,user.username)
        const loginPayload: UserPayload = {token, ...(await getUser({id:user.id}, userResponseFields))};
        const userResponse = getResponse<UserResponse>(loginPayload,'user') as UserResponse;
        return res.status(200).json(userResponse);
      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}