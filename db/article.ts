import { Article, Prisma, PrismaClient } from '@prisma/client';
import { profile } from 'console';
import { title } from 'process';
import { articleRequestFields, articleResponseFields, profileResponseFields, tagsResponseFields } from '../constants';
import Username from '../pages/api/profiles/[username]';
import { ArticleRequest, ArticleResponse, ProfilePayload, ArticleWithComputedValues, WithUserFollowing, WithTagList } from "../types";
import { getProfileWithFollowedBy } from './profile';
import { getUser } from './user';


const prisma = new PrismaClient()
// CREATE
export const createArticle = async (article:WithTagList<ArticleRequest>,username: string)=> {
  let newArticle = await prisma.article.create({
    data: {
      slug : getSlug(article.title),
      title:article.title,
      description: article.description,
      body: article.body,      
      authorUser:{
        connect:{
          username:username
        }
      },
      tags: {
        connectOrCreate: article.tagList.map((tag:string)=> { 
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

export const getArticleBySlug = (slug:string, fields?:Prisma.ArticleSelect ):any => {

}

export const getArticleWithRelations = async (query:Prisma.ArticleWhereInput, userID: string)=> {
  let articleResult = await prisma.article.findMany({
      where: query,
      select: articleResponseFields
    }
  );
  let article:any;
  for(article of articleResult){
    let articleWithRelations = article as any;
    articleWithRelations['tagList'] =  await getTagsByIDs(article.tagIDs);
    delete articleWithRelations['tagIDs'];
    articleWithRelations['author'] = await getProfileWithFollowedBy(article.author,userID);
    delete articleWithRelations['authorUser'];
    articleWithRelations['favorited'] = article.favoritedByIDs.includes(userID);
    articleWithRelations['favoritesCount'] = article.favoritedByIDs.length;    
    delete articleWithRelations['favoritedByIDs'];
    articleWithRelations = article;
  }
  return articleResult;
}

export const getTagsByIDs = async (tagIDs:string[]) => {
  if(tagIDs.length==0)
    return [];
  let tags = await prisma.tag.findMany({
    where: {
      id:{in:tagIDs}
    },
    distinct: ['title'] ,
    select:{title:true}
  });
  return tags.map(tag=>tag.title);
}

function getSlug(title:string){
  return title.toLowerCase()
  .replace(/&/g, '-and-')
  .replace(/[\s\W-]+/g, '-')
  .replace(/-$/, '');
}