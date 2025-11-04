import type { Member } from "../types/members";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { create } from "zustand";
import { profileColumns } from "../utils/profile";
import { supabase } from "../supabase";

interface MembersStore {
  members: Member[];
  isLoading: boolean;

  getMembers: () => Promise<void>;
  subscribeToMembers: () => void;
  unsubscribeToMembers: () => void;

  getRandomMembers: (count: number) => Member[];
}

let subscription: RealtimeChannel | null = null;

export const useMembersStore = create<MembersStore>((set, get) => ({
  members: [],
  isLoading: true,

  getMembers: async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select(profileColumns);

    if (error) {
      return;
    }

    const membersFromData: Member[] = [];

    data?.forEach((member) => {
      membersFromData.push({
        id: member.user_id,
        avatar: member.avatar_url ?? "",
        name: member.discord_username.replace(/^OGT(\s*(\||丨)?)?/i, ""),
        rank: member.rank,
        quote: member.quote,
        bio: member.bio,
        division: member.division,
        kills: member.total_kills,
        deaths: member.total_deaths,
        url: member.member_url,
        medals: [],
      });
    });

    set({ members: membersFromData, isLoading: false });

    return;
  },

  subscribeToMembers: () => {
    if (subscription) {
      return;
    }

    subscription = supabase
      .channel("profiles_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        (payload) => {
          set({ isLoading: true });

          const { members } = get();

          let updated = [...members];

          if (payload.eventType === "INSERT") {
            updated.push({
              id: payload.new.user_id,
              avatar: payload.new.avatar_url ?? "",
              name: payload.new.discord_username.replace(
                /^OGT(\s*(\||丨)?)?/i,
                ""
              ),
              rank: payload.new.rank,
              quote: payload.new.quote,
              bio: payload.new.bio,
              division: payload.new.division,
              kills: payload.new.total_kills,
              deaths: payload.new.total_deaths,
              url: payload.new.member_url,
              medals: [],
            });
          } else if (payload.eventType === "UPDATE") {
            updated = updated.map((member) =>
              member.id === payload.new.id
                ? {
                    id: payload.new.user_id,
                    avatar: payload.new.avatar_url ?? "",
                    name: payload.new.discord_username.replace(
                      /^OGT(\s*(\||丨)?)?/i,
                      ""
                    ),
                    rank: payload.new.rank,
                    quote: payload.new.quote,
                    bio: payload.new.bio,
                    division: payload.new.division,
                    kills: payload.new.total_kills,
                    deaths: payload.new.total_deaths,
                    url: payload.new.member_url,
                    medals: [],
                  }
                : member
            );
          } else if (payload.eventType === "DELETE") {
            updated = updated.filter((member) => member.id !== payload.old.id);
          }

          set({ members: updated, isLoading: false });
        }
      )
      .subscribe();
  },
  unsubscribeToMembers: () => {
    if (subscription) {
      supabase.removeChannel(subscription);

      subscription = null;
    }
  },

  getRandomMembers: (count: number) => {
    const { members } = get();

    if (members.length === 0) return [];

    const shuffled = [...members].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, count);
  },
}));
