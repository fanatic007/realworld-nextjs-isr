import { prisma } from './db'
import { Prisma } from ".prisma/client";
import { ProfilePayload, User, UserPayload, WithAuthorProfile, WithUserFollowing } from "../types";
import { userResponseFields } from "../constants";
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
  let commentsResult =[] as  WithAuthorProfile<Comment>[];
  for(let comment of comments){
    let commentWithAuthorProfile = comment as any;
    commentWithAuthorProfile['author'] = await getProfileWithFollowedBy(comment.author,userID);    
    delete commentWithAuthorProfile['articleSlug'];
    commentsResult.push(commentWithAuthorProfile);
  }
  return commentsResult;
}

export const deleteComment = async (commentID:string) => {
  await prisma.comment.delete({
    where:{
      id:commentID
    }
  });
}

