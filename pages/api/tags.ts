// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { tags } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTags } from '../../prisma/tags';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<tags>
) {
  switch (req.method) {
    case 'GET': {
      const tagsResponse = await getTags();
      return res.status(200).json(tagsResponse);
    }
  }
}