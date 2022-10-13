// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteComment, getCommentsWithAuthorProfile } from '../../../../../db/comment';
import { getUser } from '../../../../../db/user';
import { apiHandler } from '../../../../../helpers/api-handler';
import { getJWTPayload } from '../../../../../helpers/jwt-middleware';
import { ProfilePayload, WithAuthorProfile, WithUserFollowing } from '../../../../../types';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const slug = req.query.slug as string;
  const token = (req.headers.authorization as string).replace('Bearer ','');
  const {username} = getJWTPayload(token);
  const user = await getUser({username}, {id:true});  
  switch (req.method) {
    case 'DELETE': {
      const commentID = req.query.id as string;
      const [comment] = await getCommentsWithAuthorProfile(slug, user.id, commentID)
      if(!(comment && comment.author.username === username))
        throw Error("cannot delete");
      await deleteComment(commentID);
      return res.status(200).end();
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
}
