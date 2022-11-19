import { Article, Prisma } from '@prisma/client';
import { ARTICLE_RESPONSE_FIELDS } from '../constants';
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

export const getArticlesWithRelations = async (where:Prisma.ArticleWhereInput, userID?: string, skip?:number ,take?:number)=> {
  let articlesResult = await prisma.article.findMany({
      where,
      select: ARTICLE_RESPONSE_FIELDS,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take
    }
  );
  let article:ArticleResponseData;
  for(article of articlesResult){
    let articleWithRelations = article as SingleArticle;
    articleWithRelations['tagList'] =  await getTagsByIDs(article.tagIDs);
    delete articleWithRelations['tagIDs'];
    articleWithRelations['favoritesCount'] = article.favoritedByIDs.length;
    articleWithRelations['author'] = await getProfileWithFollowedBy(article.author as string,userID);
    if(userID){
      articleWithRelations['favorited'] = article.favoritedByIDs.includes(userID);
    }
    delete articleWithRelations['favoritedByIDs'];
    article = articleWithRelations;
  }
  return articlesResult as SingleArticle[];
}

export const updateArticle = async (query:Partial<Article>,data:Partial<Article>) => {
  if(data.title){
    data['slug'] = getSlug(data.title);
  }
  const updatedArticle = await prisma.article.update({
    where:query,
    data: data
  });
  return updatedArticle;
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

export const favoriteArticle = async (slug: string, userID: string)=> {
  let followedByUser = await prisma.article.update({
    where: {slug},
    data:{
      favoritedBy: {
        connect: {id:userID}
      }
    }
  });
  return followedByUser;
} 

export const unfavoriteArticle = async (slug: string, userID: string)=> {
  let followedByUser = await prisma.article.update({
    where: {slug},
    data:{
      favoritedBy: {
        disconnect: {id:userID}
      }
    }
  });
  return followedByUser;
} 

export const deleteArticleWithRelations = async (slug: string)=> {
  let article = await prisma.article.findUnique({
    where:{slug}
    }
  ) as Article;

  prisma.$transaction([
       disconnectAuthor(article),
    ...disconnectFavoritedBy(article),
    ...disconnectTags(article),
       deleteArticle(article)
  ]).then(()=>
      clearTags(article)
  ) ;
}

function getSlug(title:string){
  return title.toLowerCase()
  .replace(/&/g, '-and-')
  .replace(/[\s\W-]+/g, '-')
  .replace(/-$/, '');
}

function deleteArticle(article: Article){
  return prisma.article.delete({
    where: {slug:article.slug},
  })  
}

function disconnectAuthor(article:Article){
  return prisma.user.update({
    where: {
      username: article?.author as string
    },
    data: {
      authored: {
        disconnect: {slug: article?.slug},
      },      
    }
  })
}

function disconnectFavoritedBy(article:Article){
  return article.favoritedByIDs.map(id => prisma.user.update({
    where:{
      id
    },
    data:{
      favoriteArticles:{
        disconnect:{ id:article.id }
      }
    }
  }));
}

function disconnectTags(article: Article){
  return article.tagIDs.map(id=> prisma.tag.update({
    where:{
      id
    },
    data:{
      articles:{
        disconnect: { id:article.id }
      }
    }
  }));
}

async function clearTags(article:Article){
  let tags = await prisma.tag.findMany({
    where:{
      id: {in:article.tagIDs}
    },
    include:{
      articles:true
    }
  });
  tags.forEach(async tag=>{
    if(tag.articleIDs.length===0)
      await prisma.tag.delete({
        where:{
          id:tag.id
        }
      });
  });
}