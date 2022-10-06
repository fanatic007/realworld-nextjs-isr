const jwt = require('jsonwebtoken');
import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { getUser, updateUser } from '../../../prisma/user';
import { apiHandler, filterObectByType } from '../../../helpers/api-handler';
import { User, UserRequest, UserResponse } from '../../../types';

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
      let user: User = await getUser({email});
      if (!user) throw 'Username or password is incorrect';
      const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: '60s' });    
      user = await updateUser({ id: user.id },{token:token});
      const userResponse = filterObectByType<UserResponse>(user) as UserResponse;
      return res.status(200).json(userResponse);     }
}