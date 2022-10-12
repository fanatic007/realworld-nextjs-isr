// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getArticleWithRelations } from '../../../../db/article';
import { getUser } from '../../../../db/user';
import { apiHandler } from '../../../../helpers/api-handler';
import { getJWTPayload } from '../../../../helpers/jwt-middleware';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const slug = req.query.slug as string;
  
  switch (req.method) {
    case 'GET': {
      const token = (req.headers.authorization as string).replace('Bearer ','');
      const {username} = getJWTPayload(token);
      const user = await getUser({username}, {id:true});
      const [article] = await getArticleWithRelations({slug},user.id);
      return res.status(200).json({article});
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
}