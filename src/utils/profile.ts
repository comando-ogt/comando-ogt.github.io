export const profileColumns =
  "avatar_url,bio,discord_username,division,hll_level,hll_username,member_url,membership_status,quote,rank,total_deaths,total_kills,updated_at,user_id,web_role";

export function getKDR(kills: number, deaths: number): string {
  if (deaths === 0) return "1.00";

  return (kills / deaths).toFixed(2);
}
