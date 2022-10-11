// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTags } from '../../db/tags';
import { apiHandler } from '../../helpers/api-handler';
import { TagsResponse } from '../../types/';

export default apiHandler(handler);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TagsResponse>
) {
  switch (req.method) {
    case 'GET': {
      const tags: string[] = (await getTags()).map(tag=>tag.title) ; 
      return res.status(200).json({tags});
    }
    default:{
      throw new Error("Method not allowed");
    }
  }
}