import { User, Tags } from "@prisma/client";

type MappedType<Type> = {
  // For every existing property inside the type of Type
  // convert it to be a ?: version
  [Property in keyof Type]?: Type[Property];
};

type Errors = {
  body:[Partial<Error>]
}

export type ErrorResponse = { errors: Errors }

export type Tags = Tags;
export type TagsResponse = MappedType<Tags> & { tags:string[] };

export type User = User;
export type UserResponse = MappedType<User> & { email,username,password,bio,following:string };
export type UserRequest = MappedType<User> & { email,username,password:string };
export type ProfileResponse = MappedType<User> & { username,image,bio,following:string };

