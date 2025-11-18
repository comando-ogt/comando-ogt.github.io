import type { Member, MemberDivision, MemberRank } from "../types/members";

import type { DBProfile } from "../types/db";
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

    await Promise.all(
      data?.map(async (profile) => {
        const member = await createMemberFromProfile(profile);

        members.push(member);

        if (profile.membership_status === "active") {
          activeMembers.push(member);
        } else if (profile.membership_status === "merc") {
          mercenariesMembers.push(member);
        }
      })
    );

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
        async (payload) => {
          set({ isLoading: true });

          const { members } = get();

          if (payload.eventType === "DELETE") {
            set({
              members: members.filter((member) => member.id !== payload.old.id),
              isLoading: false,
            });

            return;
          }

          const newMember = await createMemberFromProfile(
            payload.new as DBProfile
          );

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

async function createMemberFromProfile(profile: DBProfile): Promise<Member> {
  let avatarUrl = "/logo.png";

  if (profile.avatar_url) {
    try {
      const { data: avatarData, error } = await supabase.storage
        .from("avatars")
        .download(profile.avatar_url);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(avatarData);

      avatarUrl = url;
    } catch (error) {
      // console.log("Error downloading avatar image: ", e.message)
    }
  }

  const member = {
    id: profile.user_id,
    avatar: avatarUrl,
    name: profile.hll_username.replace(/^OGT(\s*(\||丨)?)?/i, ""),
    rank: profile.rank as MemberRank,
    quote: profile.quote ?? "",
    bio: profile.bio ?? "",
    division: profile.division as MemberDivision,
    kills: profile.total_kills,
    deaths: profile.total_deaths,
    url: profile.member_url,
    medals: [],
  };

  return member;
}
