// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createArticle, getArticlesWithRelations } from '../../../db/article';
import { apiHandler } from '../../../helpers/api-handler';
import { getJWTPayload } from '../../../helpers/jwt-middleware';
import { ArticleResponse, ArticlesResponse, QueryParams, SingleArticle } from '../../../types/index';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<ArticlesResponse | ArticleResponse>,
  token:string
) {
  switch (req.method) {
    case 'POST': {
      const {userID, username} = getJWTPayload(token);
      const newArticle = await createArticle(req.body.article , username);
      const [article] = await getArticlesWithRelations({slug: newArticle.slug},userID);
      return res.status(200).json({article});
    }
    case 'GET': {      
      const queryParams:QueryParams = req.query;
      const articlesResponse = await getArticlesByQuery(queryParams, token);
      return res.status(200).json(articlesResponse);
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
}

export const getArticlesByQuery = async (queryParams:any, token?: string) : Promise<ArticlesResponse> => {
  let query = getArticleQuery(queryParams);
  const {userID} = token?getJWTPayload(token):{userID:undefined};
  const articles = await getArticlesWithRelations(query, userID, queryParams.offset? Number(queryParams.offset): 0, queryParams.limit? Number(queryParams.limit):100);
  return {articles: articles, articlesCount:articles.length};
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
