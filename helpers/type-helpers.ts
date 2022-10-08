import { profilePayload } from "../constants"
import { User, ProfilePayload, WithUserFollowing, FollowedByIDs  } from "../types"

export const getResponse = <T>( payload: any,fieldName:string) => {
  return { [fieldName as keyof typeof payload]:payload}
}


export const getFollowing = <ProfilePayload extends FollowedByIDs>(
  profile: ProfilePayload,
  userID: string
): WithUserFollowing<ProfilePayload> => {
  let following : boolean = profile.followedByIDs.includes(userID);
  let wuf:any = {following, ...profile}
  delete wuf['followedByIDs'];
  return wuf;
}

