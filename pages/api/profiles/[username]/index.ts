// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '../../../../helpers/api-handler';
import { getUser } from '../../../../db/user';
import { ProfilePayload, ProfileResponse } from '../../../../types/index';
import { profileResponseFields } from '../../../../constants';
import { getFollowing, getResponse } from '../../../../helpers/type-helpers';
import { getProfile } from '../../../../db/profile';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<ProfileResponse>
) {
  const username = req.query.username as string;
  switch (req.method) {
    case 'GET': {
      const profilePayload: ProfilePayload = await getProfile({username:username}, profileResponseFields);
      if(!profilePayload)
        throw new Error("Invalid Username. No user")
      const user = await getUser({token:req.headers.authorization?.replace('Bearer ','')}, {id:true});
      const profilePayloadWithFollowing = getFollowing(profilePayload,user.id)
      const profileResponse = getResponse<ProfileResponse>(profilePayloadWithFollowing,'profile') as ProfileResponse;
      return res.status(200).json(profileResponse);
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
}