import prisma from './prisma'

// READ
export const getTags = async () => {
  const tags = await prisma.tags.findFirst({});
  delete tags['id'];
  return tags;
}