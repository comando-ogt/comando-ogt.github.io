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
