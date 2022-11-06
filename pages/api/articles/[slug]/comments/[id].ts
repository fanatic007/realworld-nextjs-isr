// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteComment, getCommentsWithAuthorProfile } from '../../../../../db/comment';
import { apiHandler } from '../../../../../helpers/api-handler';
import { getJWTPayload } from '../../../../../helpers/jwt-middleware';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<void>,
  token: string
) {
  const slug = req.query.slug as string;
  const {username, userID} = getJWTPayload(token);
  switch (req.method) {
    case 'DELETE': {
      const commentID = req.query.id as string;
      const [comment] = await getCommentsWithAuthorProfile(slug, userID, commentID)
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

