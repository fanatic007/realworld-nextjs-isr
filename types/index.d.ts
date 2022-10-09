import { Prisma, Tags, User, Article, Comment } from '@prisma/client';
import { articleWithComments, loginRequest, profilePayload, tagsResponse, userRequest, userPayload } from '../constants';


type NonEmptyArray<T> = [T, ...T[]];
type Errors = { body:NonEmptyArray<Error>}

const okay: NonEmptyArray<number> = [1, 2];

type ErrorResponse = { errors: Errors }

type Tags=Tags;

type TagsResponse = Prisma.TagsGetPayload<typeof tagsResponse>;

type User=User;

type LoginRequest = Prisma.UserGetPayload<typeof loginRequest>

type UserRequest = Prisma.UserGetPayload<typeof userRequest>
type UserPayload = Prisma.UserGetPayload<typeof userPayload>
type UserResponse = { user:UserPayload }

type ProfilePayload = Prisma.UserGetPayload<typeof profilePayload>
type ProfileResponse = { profile:profile }
type WithUserFollowing<T> = T & {
  following: boolean
}
type FollowedByIDs = {
  followedByIDs: string[];
}
