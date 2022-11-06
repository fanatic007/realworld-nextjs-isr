// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getArticlesWithRelations } from '../../../db/article';
import { apiHandler } from '../../../helpers/api-handler';
import { getJWTPayload } from '../../../helpers/jwt-middleware';
import { ArticleResponse, ArticlesResponse, QueryParams } from '../../../types/index';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<ArticlesResponse | ArticleResponse>,
  token: string
) {
  const {userID} = getJWTPayload(token);  
  switch (req.method) {
    case 'GET': {
      const queryParams:QueryParams = req.query;
      let query = {        
        authorUser: {
          followedByIDs:{has:userID}
        }
      }
      const articles = await getArticlesWithRelations(query, userID, queryParams.offset, queryParams.limit);
      return res.status(200).json({articles: articles, articlesCount:articles.length});
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
}