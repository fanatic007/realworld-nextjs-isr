// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { favoriteArticle, getArticlesWithRelations, unfavoriteArticle } from '../../../../db/article';
import { createComment } from '../../../../db/comment';
import { getUser } from '../../../../db/user';
import { apiHandler } from '../../../../helpers/api-handler';
import { getJWTPayload } from '../../../../helpers/jwt-middleware';
import { ArticleResponse } from '../../../../types';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const slug = req.query.slug as string;
  const token = (req.headers.authorization as string).replace('Bearer ','');
  const {username} = getJWTPayload(token);
  const user = await getUser({username}, {id:true});
  const commentBody = req.body.comment.body;
  switch (req.method) {
    case 'POST': {console.log("params here:",commentBody,slug,username);
      await createComment(req.body.comment.body,username,slug);
      break;
    }
    case 'DELETE': {
      await unfavoriteArticle(slug,user.id);
      break;
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
  const [article] = await getArticlesWithRelations({slug},user.id);
  return res.status(200).json({article});
}

