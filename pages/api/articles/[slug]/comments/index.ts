// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { createComment, getCommentsWithAuthorProfile } from '../../../../../db/comment';
import { apiHandler } from '../../../../../helpers/api-handler';
import { getJWTPayload } from '../../../../../helpers/jwt-middleware';
import { CommentResponse, CommentsResponse } from '../../../../../types';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<CommentResponse | CommentsResponse>,
  token: string
) {
  const slug = req.query.slug as string;
  const {username, userID} = getJWTPayload(token);
  switch (req.method) {
    case 'POST': {
      const commentBody = req.body.comment.body;
      let newComment = await createComment(commentBody,username,slug);
      let [comment] = await getCommentsWithAuthorProfile(slug, userID, newComment.id);
      return res.status(200).json({comment});
    }
    case 'GET': {
      let comments = await getCommentsWithAuthorProfile(slug, userID);
      return res.status(200).json({comments});
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
}

