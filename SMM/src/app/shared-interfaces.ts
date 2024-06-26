export interface LoginResponse {
  accessToken: string;
  userid: string;
}

export interface GetVipsResponse {
  _id: string;
  accepted: boolean;
  smmId: string;
  vipId: string;
}

export interface GetInfosVip{
  aumentoQuota: number;
  blocked: boolean;
  dailyChar: number;
  email: string;
  firstname: string;
  monthlyChar: number;
  password: string;
  professional: boolean;
  profilePic: string;
  refreshToken: string;
  surname: string;
  username: string;
  verified: boolean;
  weeklyChar: number;
  __v: number;
  _id: string;
}

export interface UserData {
  _id: string;
  username: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface GetCharsResponse {
  _id: string;
  dailyChar: number;
  monthlyChar: number;
  weeklyChar: number;
}
export interface Characters {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface Group {
  _id: string;
  name: string;
  private: boolean;
  editorialChannel: boolean;
  profilePic: string;
}

export interface Receiver{
  group: Group;
  groupType: string;
  _id: string;
}

export interface GroupInfo {
  _id: string;
  infoName: string;
  private: boolean;
  editorialChannel: boolean;
  profilePic: string;
}

export interface ReceiverInfo{
  group: GroupInfo;
  groupType: string;
  _id: string;
}

export interface SquealsResponse {
  _id: string;
  author: string;
  publicSqueal: boolean;
  receivers: Receiver[];
  officialChannel: boolean;
  content: string;
  contentType: string;
  impression: number;
  createdAt: string;
  tempGeolocation: boolean;
  __v: number;
  category: string;
}

export interface SquealsInfo{
  _id: string;
  author: string;
  publicSqueal: boolean;
  officialChannel: boolean;
  content: string;
  contentType: string;
  impression: number;
  createdAt: string;
  __v: number;
  receivers: Receiver[];
  category: string;
  tempGeolocation: boolean;
  
  convertedDate: string;
  neg0Reac: number;
  neg1Reac: number;
  pos2Reac: number;
  pos3Reac: number;
  weightedPosReac: number;
  weightedNegReac: number;
}

export interface GetReactionResponse {
  neg0Reac: number;
  neg1Reac: number;
  pos2Reac: number;
  pos3Reac: number;
  yourReac: number;
}
export interface GetCommentResponse {
  author: string;
  content: string;
  createdAt: string;
  _id: string;
  __v: number;
  squealId: string;
}
export interface CommentInfo {
  usernameAuthor: string;
  content: string;
}
export interface FilterParams {
  orderBy: string;
  contentTypes: string[];
  contentPopularity: string[];
  contentPrivacy: string[];
}
export interface Vip {
  id: string;
  username: string;
  profilePic: string;
}

