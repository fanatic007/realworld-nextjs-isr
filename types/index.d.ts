import { Prisma, Tags, User, Article, Comment } from '@prisma/client';
import { articleWithComments, loginRequest, profilePayload, tagsResponse, userRequest, userPayload } from '../constants';

type Errors = { body:string[]}

export type ErrorResponse = { errors: Errors }

export type Tags=Tags;

export type TagsResponse = Prisma.TagsGetPayload<typeof tagsResponse>;

export type User=User;

export type LoginRequest = Prisma.UserGetPayload<typeof loginRequest>

export type UserRequest = Prisma.UserGetPayload<typeof userRequest>

export type UserPayload = Prisma.UserGetPayload<typeof userPayload>
export type UserResponse = { user:UserPayload }
export type ProfilePayload = Prisma.UserGetPayload<typeof profilePayload>
export type ProfileResponse = { profile:profile }