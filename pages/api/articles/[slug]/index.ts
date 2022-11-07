// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Article } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteArticleWithRelations, getArticlesWithRelations, updateArticle } from '../../../../db/article';
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
  const {userID, username} = token?getJWTPayload(token) : {userID:undefined, username:undefined};
  const [article] = await getArticlesWithRelations({slug},userID);
  switch (req.method) {
    case 'GET': {
      return res.status(200).json({article});
    }
    case 'PUT': {
      let data = req.body.article;
      if(!(article && article.author.username === username))
        throw Error("cannot update");
      const updatedArticle = await updateArticle({slug},data) as Article;
      const [updatedArticleWithRelations] = await getArticlesWithRelations({slug:updatedArticle.slug},userID);
      return res.status(200).json({article:updatedArticleWithRelations});
    }
    case 'DELETE': {
      if(!(article && article.author.username === username))
        throw Error("cannot delete");
      await deleteArticleWithRelations(slug);
      return res.status(200).end();
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
}