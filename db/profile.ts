import { prisma } from './db'
import { ProfilePayload, WithUserFollowing } from "../types";
import { getUser } from "./user";
import { profileResponseFields } from "../constants";

// READ
export const getProfileWithFollowedBy = async  (username:string,userID?: string)=> {
  const profile: ProfilePayload = await getUser({username}, profileResponseFields);
  if(userID){
    const profileWithFollowing: WithUserFollowing<ProfilePayload> = {following:false,...profile}
    const followedBy = await prisma.user.findMany({
      where:  {
        username: profile.username,
        followedByIDs: {
          has: userID,
        }
      },
    });
    profileWithFollowing.following = followedBy.length>0;
    return profileWithFollowing;
  }
  return profile;
}

// Update
export const followUser = async (username:string,userID: string)=> {
  let followedByUser = await prisma.user.update({
    where:  {
      username: username,
    },
    data:{
      followedBy: {
        connect: {id:userID}
      }
    }
  });
  return followedByUser;
}

export const unfollowUser = async (username:string,userID: string)=> {
  let followedByUser = await prisma.user.update({
    where:  {
      username: username,
    },
    data:{
      followedBy: {
        disconnect: {id:userID}
      }
    }
  });
  return followedByUser;
}