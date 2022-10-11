// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '../../../helpers/api-handler';
import { getJWTPayload } from '../../../helpers/jwt-middleware';
import { ProfileResponse } from '../../../types/index';
import { createArticle } from '../../../db/article';
import { Article } from '@prisma/client';

export default apiHandler(handler);

async function handler (
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const articleSlug = req.query.slug as string | undefined;
  switch (req.method) {
    case 'POST': {
      const token = (req.headers.authorization as string).replace('Bearer ','');
      const {username} = getJWTPayload(token);
      const article = await createArticle(req.body.article , username);
      return res.status(200).json({article});
    }
    default: {
      throw new Error("Method Not Allowed")
    }
  }
}