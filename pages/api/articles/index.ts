// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '../../../helpers/api-handler';
import { getJWTPayload } from '../../../helpers/jwt-middleware';
import { ArticleResponse, ArticlesResponse, ProfileResponse } from '../../../types/index';
import { createArticle, getArticlesWithRelations } from '../../../db/article';
import { Article } from '@prisma/client';
import { getUser } from '../../../db/user';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<ArticlesResponse | ArticleResponse>
) {
  const token = (req.headers.authorization as string).replace('Bearer ','');
  const {username} = getJWTPayload(token);
  const user = await getUser({username}, {id:true});
  switch (req.method) {
    case 'POST': {
      const {username} = getJWTPayload(token);
      const newArticle = await createArticle(req.body.article , username);
      const [article] = await getArticlesWithRelations({slug: newArticle.slug},user.id);
      return res.status(200).json({article});
    }
    case 'GET': {
      let query = req.query;
      const articles = await getArticlesWithRelations(query,user.id);
      return res.status(200).json({articles: articles, articlesCount:articles.length});
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
}