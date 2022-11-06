// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteArticleWithRelations, getArticlesWithRelations } from '../../../../db/article';
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
  switch (req.method) {
    case 'GET': {
      const userID = token?getJWTPayload(token).id : undefined;
      const [article] = await getArticlesWithRelations({slug},userID);
      return res.status(200).json({article});
    }
    case 'DELETE': {
      const {username,userID} = getJWTPayload(token);
      const [article] = await getArticlesWithRelations({slug},userID);
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