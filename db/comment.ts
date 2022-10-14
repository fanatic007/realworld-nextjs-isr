import { SingleComment } from "../types";
import { prisma } from './db';
import { getProfileWithFollowedBy } from './profile';

export const createComment = async (body:string, username:string,slug:string)=> {
  return await prisma.comment.create({
    data: {
      body, 
      article: {
        connect: { slug }
      },
      authorUser:{
        connect:{ username }
      }, 
    }
  });
}

export const getCommentsWithAuthorProfile = async (slug:string, userID:string, commentID?:string) => {
  let comments = await prisma.comment.findMany({
    where: {
      id:commentID,
      articleSlug: slug
    },
  });
  let commentsResult =[];
  for(let comment of comments){
    let commentWithAuthorProfile = comment as any;
    commentWithAuthorProfile['author'] = await getProfileWithFollowedBy(comment.author,userID);    
    commentsResult.push(commentWithAuthorProfile);
  }
  return commentsResult  as SingleComment[];
}

export const deleteComment = async (commentID:string) => {
  await prisma.comment.delete({
    where:{
      id:commentID
    }
  });
}

