import { TagsResponse} from "../types";
import { PrismaClient } from '@prisma/client'
import { tagsResponseFields } from "../constants";

const prisma = new PrismaClient();
// READ
export const getTags = async () => {
  let [tags]: TagsResponse[] = await prisma.tags.findMany({
    select: tagsResponseFields
  });
  if(!tags)
    tags= await initTags();
  return tags;
}
//UPSERT
export const addTag = async (newTag:string) => {
  let [currentTags] = await prisma.tags.findMany();
  !currentTags && initTags()
  return await prisma.tags.update({
    where: {},
    data: {
      tags: {
        set: [...currentTags.tags, newTag],
      },
    },
    select: tagsResponseFields
  });
}

async function initTags(){
  return await prisma.tags.create({
    data: {
      tags: [],
    },
    select: tagsResponseFields
  })
}