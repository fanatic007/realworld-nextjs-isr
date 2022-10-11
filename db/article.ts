import { PrismaClient } from '@prisma/client';
import { title } from 'process';
import Username from '../pages/api/profiles/[username]';
import { ArticleRequest, ProfilePayload, WithUserFollowing } from "../types";


const prisma = new PrismaClient()
// CREATE
export const createArticle = async ({title,description,body,tagList}:ArticleRequest,username: string)=> {
  let newArticle = await prisma.article.create({
    data: {
      slug : getSlug(title),
      title,
      description,
      body,
      author:{
        connect:{
          username:username
        }
      },
      tags: {
        connectOrCreate: tagList.map(tag=> { 
            return { 
              where: { title:tag },
              create: {title:tag }
            } 
          }
        )
      }    
    },  
  });
  return newArticle;
}

function getSlug(title:string){
  return title.toLowerCase()
  .replace(/&/g, '-and-')
  .replace(/[\s\W-]+/g, '-')
  .replace(/-$/, '');
}