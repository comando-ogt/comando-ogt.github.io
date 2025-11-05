import type { Member } from "../types/members";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { create } from "zustand";
import { profileColumns } from "../utils/profile";
import { supabase } from "../supabase";

interface MembersStore {
  members: Member[];
  activeMembers: Member[];
  mercenariesMembers: Member[];
  isLoading: boolean;

  getMembers: () => Promise<void>;
  subscribeToMembers: () => void;
  unsubscribeToMembers: () => void;

  getRandomMembers: (count: number) => Member[];
}

let subscription: RealtimeChannel | null = null;

export const useMembersStore = create<MembersStore>((set, get) => ({
  members: [],
  activeMembers: [],
  mercenariesMembers: [],
  isLoading: true,

  getMembers: async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select(profileColumns);

    if (error) {
      return;
    }

    const members: Member[] = [];
    const activeMembers: Member[] = [];
    const mercenariesMembers: Member[] = [];

    data?.forEach((profile) => {
      const member = {
        id: profile.user_id,
        avatar: profile.avatar_url ?? "",
        name: profile.hll_username.replace(/^OGT(\s*(\||丨)?)?/i, ""),
        rank: profile.rank,
        quote: profile.quote,
        bio: profile.bio,
        division: profile.division,
        kills: profile.total_kills,
        deaths: profile.total_deaths,
        url: profile.member_url,
        medals: [],
      };

      members.push(member);

      if (profile.membership_status === "active") {
        activeMembers.push(member);
      } else if (profile.membership_status === "merc") {
        mercenariesMembers.push(member);
      }
    });

    set({ members, activeMembers, mercenariesMembers, isLoading: false });

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

          if (payload.eventType === "DELETE") {
            set({
              members: members.filter((member) => member.id !== payload.old.id),
              isLoading: false,
            });

            return;
          }

          const newMember = {
            id: payload.new.user_id,
            avatar: payload.new.avatar_url ?? "",
            name: payload.new.hll_username.replace(/^OGT(\s*(\||丨)?)?/i, ""),
            rank: payload.new.rank,
            quote: payload.new.quote,
            bio: payload.new.bio,
            division: payload.new.division,
            kills: payload.new.total_kills,
            deaths: payload.new.total_deaths,
            url: payload.new.member_url,
            medals: [],
          };

          if (payload.eventType === "INSERT") {
            set({ members: [...members, newMember], isLoading: false });

            return;
          }

          if (payload.eventType === "UPDATE") {
            const activeMembers: Member[] = [];
            const mercenariesMembers: Member[] = [];

            for (let i = 0; i < members.length; i++) {
              let member = members[i];

              if (member.id === newMember.id) {
                member = newMember;
              }

              if (payload.new.membership_status === "active") {
                activeMembers.push(member);
              } else if (payload.new.membership_status === "merc") {
                mercenariesMembers.push(member);
              }

              members[i] = member;
            }

            set({
              members,
              activeMembers,
              mercenariesMembers,
              isLoading: false,
            });

            return;
          }
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
    const { activeMembers } = get();

    if (activeMembers.length === 0) return [];

    const shuffled = [...activeMembers].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, count);
  },
}));
