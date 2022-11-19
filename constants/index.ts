import { User } from "../types/";
import { Prisma } from '@prisma/client';

export const EXPIRY_TIME = '600s';
export const PAGE_SIZE = 10;
export const PAGES = Array.from(Array(10).keys()).map((number:number)=>number+1);

export const USER_DEFAULT: Partial<User> = {
  image:'',
  bio:''
}

export const TAGS_RESPONSE_FIELDS = { title: true }

export const LOGIN_REQUEST_FIELDS = { email:true, password:true };
export const USER_GET_REQUEST_FIELDS = { email:true,username:true,password:true };
export const USER_UPDATE_REQUEST_FIELDS = { email:true, username:true ,password:true ,bio:true, image:true };
export const USER_RESPONSE_FIELDS= { email:true,username:true,image:true, bio:true};
export const PROFILE_RESPONSE_FIELDS = { username:true ,image:true ,bio:true };
export const ARTICLE_REQUEST_FIELDS = { title: true, description: true, body: true }
export const ARTICLE_RESPONSE_FIELDS = { slug:true,title: true, description: true, body: true, createdAt:true, updatedAt:true, favoritedByIDs:true, author:true, tagIDs:true}

export const TAGS_RESPONSE = Prisma.validator<Prisma.TagArgs>()({ select: TAGS_RESPONSE_FIELDS});
export const LOGIN_REQUEST = Prisma.validator<Prisma.UserArgs>()({ select: LOGIN_REQUEST_FIELDS  });
export const USER_REQUEST = Prisma.validator<Prisma.UserArgs>()({ select: USER_GET_REQUEST_FIELDS });
export const USER_PAYLOAD = Prisma.validator<Prisma.UserArgs>()({ select: USER_RESPONSE_FIELDS });
export const PROFILE_PAYLOAD = Prisma.validator<Prisma.UserArgs>()({ select: PROFILE_RESPONSE_FIELDS });
export const ARTICLE_REQUEST = Prisma.validator<Prisma.ArticleArgs>()({ select: ARTICLE_REQUEST_FIELDS });
export const ARTICLE_RESPONSE = Prisma.validator<Prisma.ArticleArgs>()({ select: ARTICLE_RESPONSE_FIELDS });