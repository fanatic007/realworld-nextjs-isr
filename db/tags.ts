import { TagsResponse} from "../types";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
// READ
export const getTags = async () => {
  let tags = await prisma.tag.findMany({
    where: {},
    distinct: ['title'] ,
    select:{title:true}
  });
  return tags;
}