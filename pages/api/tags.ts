// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTags } from '../../prisma/tags';
import { apiHandler, filterObectByType } from '../../helpers/api-handler';
import { Tags, TagsResponse } from '../../types';

export default apiHandler(handler);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TagsResponse>
) {
  switch (req.method) {
    case 'GET': {
      const tags: Tags = await getTags() as Tags;
      const tagsResponse: TagsResponse = filterObectByType<TagsResponse>(tags) as TagsResponse;
      return res.status(200).json(tagsResponse);
    }
    default:{
      throw new Error("Method not allowed");
    }
  }
}