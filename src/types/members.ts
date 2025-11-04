export type MemberRank =
  | "merc"
  | "recruit"
  | "private"
  | "corporal"
  | "sergeant"
  | "cadet"
  | "lieutenant"
  | "captain"
  | "major"
  | "colonel"
  | "general";
export type MemberDivision =
  | "commander"
  | "defense"
  | "infOne"
  | "infTwo"
  | "infThree"
  | "recon"
  | "tank"
  | "flex"
  | "none";

export interface Medal {
  name: string;
  description: string;
  icon: string;
}

export interface Member {
  id: string;
  avatar: string;
  name: string;
  rank: MemberRank;
  quote: string;
  bio: string;
  division: MemberDivision;
  kills: number;
  deaths: number;
  url: string;
  medals: Medal[];
}
