// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { favoriteArticle, getArticlesWithRelations, unfavoriteArticle } from '../../../../db/article';
import { getUser } from '../../../../db/user';
import { apiHandler } from '../../../../helpers/api-handler';
import { getJWTPayload } from '../../../../helpers/jwt-middleware';
import { ArticleResponse } from '../../../../types';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<ArticleResponse>
) {
  const slug = req.query.slug as string;
  const token = (req.headers.authorization as string).replace('Bearer ','');
  const {username} = getJWTPayload(token);
  const user = await getUser({username}, {id:true});
  switch (req.method) {
    case 'POST': {
      await favoriteArticle(slug,user.id);
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

