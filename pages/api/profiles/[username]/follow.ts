// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { followUser, getProfileWithFollowedBy, unfollowUser } from '../../../../db/profile';
import { apiHandler } from '../../../../helpers/api-handler';
import { getJWTPayload } from '../../../../helpers/jwt-middleware';
import { getResponse } from '../../../../helpers/type-helpers';
import { ProfileResponse } from '../../../../types/index';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<ProfileResponse>
) {
  const profileSlug = req.query.username as string;
  const token = (req.headers.authorization as string).replace('Bearer ','');
  const {userID} = getJWTPayload(token);

  switch (req.method) {
    case 'POST': {
      await followUser(profileSlug,userID);
      break;
    }
    case 'DELETE': {
      await unfollowUser(profileSlug,userID);
      break;
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
  const profileWithFollowedBy = await getProfileWithFollowedBy(profileSlug, userID);
  const profileResponse = getResponse<ProfileResponse>(profileWithFollowedBy,'profile') as ProfileResponse;
  return res.status(200).json(profileResponse);
}