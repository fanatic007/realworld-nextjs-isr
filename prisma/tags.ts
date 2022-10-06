import {Tags} from "../types";
import { PrismaClient } from '@prisma/client'
import { TAGS_ID } from "../constants";

const prisma = new PrismaClient();
// READ
export const getTags = async () => {
  const [tags]: Tags[] = await prisma.tags.findMany();
  !tags && initTags();
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
    }
  }) as Tags;
}

async function initTags(){
  await prisma.tags.create({
    data: {
      tags: [],
    }
  })
}