import { Prisma } from ".prisma/client";
import { ProfilePayload, User, UserPayload, WithUserFollowing } from "../types";
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()
// READ
export const getProfileWithFollowedBy = async (profile:ProfilePayload,userID: string)=> {
  let profileWithFollowing: WithUserFollowing<ProfilePayload> = {following:false,...profile}
  let followedBy = await prisma.user.findMany({
    where:  {
      username: profile.username,
      followedByIDs: {
        has: userID,
      }
    },
  });
  profileWithFollowing.following = followedBy.length>0
  return profileWithFollowing;
}

// Update
export const followUser = async (profile:ProfilePayload,userID: string)=> {
  let followedByUser = await prisma.user.update({
    where:  {
      username: profile.username,
    },
    data:{
      followedBy: {
        connect: {id:userID}
      }
    }
  });
  return followedByUser;
}

export const unfollowUser = async (profile:ProfilePayload,userID: string)=> {
  let followedByUser = await prisma.user.update({
    where:  {
      username: profile.username,
    },
    data:{
      followedBy: {
        disconnect: {id:userID}
      }
    }
  });
  return followedByUser;
}