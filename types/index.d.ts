import { Prisma, Tags, User, Article, Comment } from '@prisma/client';
import { articleWithComments, LOGIN_REQUEST, PROFILE_PAYLOAD, TAGS_RESPONSE, USER_REQUEST, USER_PAYLOAD, ARTICLE_REQUEST, ARTICLE_RESPONSE } from '../constants';
import * as jest from '@types/jest';

type NonEmptyArray<T> = [T, ...T[]];
type Errors = { body:NonEmptyArray<Error>}

const okay: NonEmptyArray<number> = [1, 2];

type ErrorResponse = { errors: Errors }

type Tags=Tags;

type TagsResponse = Prisma.TagsGetPayload<typeof TAGS_RESPONSE>;

type User=User;

type LoginRequest = Prisma.UserGetPayload<typeof LOGIN_REQUEST>

type UserRequest = Prisma.UserGetPayload<typeof USER_REQUEST>
type UserPayload = Prisma.UserGetPayload<typeof USER_PAYLOAD> & {token:string};
type UserResponse = { user:UserPayload }

type ProfilePayload = Prisma.UserGetPayload<typeof PROFILE_PAYLOAD>
type ProfileResponse = { profile:WithUserFollowing<ProfilePayload> }
type WithUserFollowing<T> = T & {
  following: boolean
}
type FollowedByIDs = {
  followedByIDs: string[];
}

type Article = Article;

type ArticleRequest = Prisma.ArticleGetPayload<typeof ARTICLE_REQUEST>;
type ArticleResponseData = Prisma.ArticleGetPayload<typeof ARTICLE_RESPONSE>;

type ArticleWithComputedValues<T> = T & {
  author : WithFollowing<ProfilePayload>,
  favorited: boolean,
  favoritesCount: number,
  favoritedByIDs: never,
  tagIDs: never
}

type WithTagList<T> = T & {
  tagList: string[]
}

type SingleArticle = WithTagList<ArticleWithComputedValues<ArticleResponseData>>;
type ArticlesResponse = {articles: SingleArticle[], articlesCount:number};
type ArticleResponse = {article: SingleArticle};

type QueryParams = {
  favorited?:string,
  tag?:string,
  author?:string,
  limit?:number,
  offset?:number
}

type Comment = Comment;

type WithAuthorProfile<T> = T & {
  author: WithUserFollowing<ProfilePayload>
  articleSlug: never;
}
type SingleComment = WithAuthorProfile<Comment>
type CommentsResponse = { comments:SingleComment[] }
type CommentResponse = { comment:SingleComment }

