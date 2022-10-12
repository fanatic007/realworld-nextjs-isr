// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '../../../helpers/api-handler';
import { getJWTPayload } from '../../../helpers/jwt-middleware';
import { ProfileResponse } from '../../../types/index';
import { createArticle, getArticleWithRelations } from '../../../db/article';
import { Article } from '@prisma/client';
import { getUser } from '../../../db/user';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  switch (req.method) {
    case 'POST': {
      const token = (req.headers.authorization as string).replace('Bearer ','');
      const {username} = getJWTPayload(token);
      const article = await createArticle(req.body.article , username);
      return res.status(200).json({article});
    }
    case 'GET': {
      const token = (req.headers.authorization as string).replace('Bearer ','');
      const {username} = getJWTPayload(token);
      const user = await getUser({username}, {id:true});
      let query = req.query;
      const articles = await getArticleWithRelations(query,user.id);
      return res.status(200).json({articles, articlesCount:articles.length});
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
}