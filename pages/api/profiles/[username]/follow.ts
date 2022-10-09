// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { profileResponseFields } from '../../../../constants';
import { followUser, getProfileWithFollowedBy, unfollowUser } from '../../../../db/profile';
import { getUser } from '../../../../db/user';
import { apiHandler } from '../../../../helpers/api-handler';
import { getJWTPayload } from '../../../../helpers/jwt-middleware';
import { getResponse } from '../../../../helpers/type-helpers';
import { ProfilePayload, ProfileResponse } from '../../../../types/index';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<ProfileResponse>
) {
  const profileSlug = req.query.username as string;
  const profilePayload: ProfilePayload = await getUser({username:profileSlug}, profileResponseFields);
  if(!profilePayload)
    throw new Error("Invalid Username. No such Profile")
  const token = (req.headers.authorization as string).replace('Bearer ','');
  const {username} = getJWTPayload(token);
  const user = await getUser({username}, {id:true});

  switch (req.method) {
    case 'POST': {
      await followUser(profilePayload,user.id);
      break;
    }
    case 'DELETE': {
      await unfollowUser(profilePayload,user.id);
      break;
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
  const profileWithFollowedBy = await getProfileWithFollowedBy(profilePayload, user.id);
  const profileResponse = getResponse<ProfileResponse>(profileWithFollowedBy,'profile') as ProfileResponse;
  return res.status(200).json(profileResponse);
}