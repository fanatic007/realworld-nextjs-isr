// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTags } from '../../prisma/tags';


type TagsResponse = {
  tags:[string]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TagsResponse>
) {
  switch (req.method) {
    case 'GET': {
      const tagsResponse = {tags:await getTags()};
      return res.status(200).json(tagsResponse);
    }
  }
}