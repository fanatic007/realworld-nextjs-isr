// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createArticle, getArticlesWithRelations } from '../../../db/article';
import { apiHandler } from '../../../helpers/api-handler';
import { getJWTPayload } from '../../../helpers/jwt-middleware';
import { ArticleResponse, ArticlesResponse, QueryParams } from '../../../types/index';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<ArticlesResponse | ArticleResponse>,
  token:string
) {
  const {userID, username} = getJWTPayload(token);
  switch (req.method) {
    case 'POST': {
      const newArticle = await createArticle(req.body.article , username);
      const [article] = await getArticlesWithRelations({slug: newArticle.slug},userID);
      return res.status(200).json({article});
    }
    case 'GET': {
      const queryParams:QueryParams = req.query;
      let query = getArticleQuery(queryParams);
      const articles = await getArticlesWithRelations(query, userID, queryParams.offset, queryParams.limit);
      return res.status(200).json({articles: articles, articlesCount:articles.length});
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
}

const getArticleQuery = (queryParams:QueryParams)=> {
  let query = {
    tags: {
      some: {
        title: {
          contains: queryParams.tag,
        },
      },
    },
    favoritedBy: {
      some: {
        username: {
          contains: queryParams.favorited,
        },
      },
    },
    author: queryParams.author,
  } as any;

  if(!queryParams['tag'])
    delete query['tags']

  if(!queryParams['favorited'])
    delete query['favoritedBy']
    
  if(!queryParams['author'])
    delete query['author']

  return query as Prisma.ArticleWhereInput;
}
