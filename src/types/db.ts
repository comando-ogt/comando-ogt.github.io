export interface DBEvent {
  id: number;
  created_at: string; // timestamp with time zone
  title: string;
  opponent: string;
  opponent_logo: string | null;
  type: string;
  team_score: number;
  opponent_score: number;
  map: string;
  schedule_at: string; // timestamp with time zone
  notes: string;
}

export interface DBProfile {
  avatar_url: string | null;
  bio: string | null;
  discord_username: string;
  division: string | null;
  hll_level: number;
  hll_username: string;
  member_url: string;
  membership_status: string;
  quote: string | null;
  rank: string | null;
  total_deaths: number;
  total_kills: number;
  updated_at: string | null;
  user_id: string;
  web_role: string;
}
