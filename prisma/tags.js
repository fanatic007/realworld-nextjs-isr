import prisma from './prisma'

// READ
export const getTags = async () => {
  const tags = await prisma.tags.findMany({});
  console.log(tags);
  return tags.map(tagDoc=>tagDoc.tag);
}