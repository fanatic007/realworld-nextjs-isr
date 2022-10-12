import { Prisma } from '@prisma/client';
import { articleResponseFields } from '../constants';
import { ArticleRequest, ArticleResponseData, SingleArticle, WithTagList } from "../types";
import { prisma } from './db';
import { getProfileWithFollowedBy } from './profile';

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

export const getArticlesWithRelations = async (query:Prisma.ArticleWhereInput, userID: string)=> {
  let articlesResult = await prisma.article.findMany({
      where: query,
      select: articleResponseFields
    }
  );
  let article:ArticleResponseData;
  for(article of articlesResult){
    let articleWithRelations = article as SingleArticle;
    articleWithRelations['tagList'] =  await getTagsByIDs(article.tagIDs);
    delete articleWithRelations['tagIDs'];
    articleWithRelations['author'] = await getProfileWithFollowedBy(article.author,userID);
    articleWithRelations['favorited'] = article.favoritedByIDs.includes(userID);
    articleWithRelations['favoritesCount'] = article.favoritedByIDs.length;    
    delete articleWithRelations['favoritedByIDs'];
    article = articleWithRelations;
  }
  return articlesResult as SingleArticle[];
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