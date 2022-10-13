// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { favoriteArticle, getArticlesWithRelations, unfavoriteArticle } from '../../../../../db/article';
import { createComment, deleteComment, getCommentsWithAuthorProfile } from '../../../../../db/comment';
import { getUser } from '../../../../../db/user';
import { apiHandler } from '../../../../../helpers/api-handler';
import { getJWTPayload } from '../../../../../helpers/jwt-middleware';
import { ArticleResponse } from '../../../../../types';

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
    case 'POST': {
      const commentBody = req.body.comment.body;
      let newComment = await createComment(commentBody,username,slug);
      let [comment] = await getCommentsWithAuthorProfile(slug, user.id, newComment.id);
      return res.status(200).json({comment});
    }
    case 'GET': {
      let comments = await getCommentsWithAuthorProfile(slug, user.id);
      return res.status(200).json({comments});
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
}

