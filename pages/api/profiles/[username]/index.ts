// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getProfileWithFollowedBy } from '../../../../db/profile';
import { apiHandler } from '../../../../helpers/api-handler';
import { getJWTPayload } from '../../../../helpers/jwt-middleware';
import { getResponse } from '../../../../helpers/type-helpers';
import { ProfileResponse } from '../../../../types/index';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<ProfileResponse>,
  token:string
) {
  const profileSlug = req.query.username as string;
  switch (req.method) {
    case 'GET': {
      const {userID} = getJWTPayload(token);
      const profileWithFollowedBy = await getProfileWithFollowedBy(profileSlug, userID);
      const profileResponse = getResponse<ProfileResponse>(profileWithFollowedBy,'profile') as ProfileResponse;
      return res.status(200).json(profileResponse);
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
}