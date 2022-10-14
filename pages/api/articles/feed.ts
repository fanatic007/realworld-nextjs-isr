// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getArticlesWithRelations } from '../../../db/article';
import { getUser } from '../../../db/user';
import { apiHandler } from '../../../helpers/api-handler';
import { getJWTPayload } from '../../../helpers/jwt-middleware';
import { ArticleResponse, ArticlesResponse, QueryParams } from '../../../types/index';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<ArticlesResponse | ArticleResponse>
) {
  const token = (req.headers.authorization as string).replace('Bearer ','');
  const {id,username} = getJWTPayload(token);
  
  const user = await getUser({username}, {id:true});
  switch (req.method) {
    case 'GET': {
      const queryParams:QueryParams = req.query;
      let query = {        
        authorUser: {
          followedByIDs:{has:id}
        }
      }
      const articles = await getArticlesWithRelations(query, user.id, queryParams.offset, queryParams.limit);
      return res.status(200).json({articles: articles, articlesCount:articles.length});
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
}