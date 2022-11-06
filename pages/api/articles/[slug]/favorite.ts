// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { favoriteArticle, getArticlesWithRelations, unfavoriteArticle } from '../../../../db/article';
import { apiHandler } from '../../../../helpers/api-handler';
import { getJWTPayload } from '../../../../helpers/jwt-middleware';
import { ArticleResponse } from '../../../../types';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<ArticleResponse>,
  token: string
) {
  const slug = req.query.slug as string;
  const {userID} = getJWTPayload(token);
  switch (req.method) {
    case 'POST': {
      await favoriteArticle(slug,userID);
      break;
    }
    case 'DELETE': {
      await unfavoriteArticle(slug,userID);
      break;
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
  const [article] = await getArticlesWithRelations({slug},userID);
  return res.status(200).json({article});
}

