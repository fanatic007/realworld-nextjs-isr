import { User } from "../types/";
import { Prisma } from '@prisma/client';

export const USER_DEFAULT: Partial<User> = {
  image:'',
  bio:'',
  token:''
}

export const tagsResponseFields = { title: true }

export const loginRequestFields = { email:true, password:true };
export const userGetRequestFields = { email:true,username:true,password:true };
export const userUpdateRequestFields = { email:true, username:true ,password:true ,bio:true, image:true };
export const userResponseFields= { email:true,username:true,image:true, bio:true, token:true };
export const profileResponseFields = { username:true ,image:true ,bio:true };
export const articleRequestFields = { title: true, description: true, body: true }
export const articleResponseFields = { slug:true,title: true, description: true, body: true, createdAt:true, updatedAt:true, favoritedByIDs:true, author:true, tagIDs:true}

export const tagsResponse = Prisma.validator<Prisma.TagArgs>()({ select: tagsResponseFields});
export const loginRequest = Prisma.validator<Prisma.UserArgs>()({ select: loginRequestFields  });
export const userRequest = Prisma.validator<Prisma.UserArgs>()({ select: userGetRequestFields });
export const userPayload = Prisma.validator<Prisma.UserArgs>()({ select: userResponseFields });
export const profilePayload = Prisma.validator<Prisma.UserArgs>()({ select: profileResponseFields });
export const articleRequest = Prisma.validator<Prisma.ArticleArgs>()({ select: articleRequestFields });
export const articleResponse = Prisma.validator<Prisma.ArticleArgs>()({ select: articleResponseFields });
