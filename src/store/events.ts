import type { DBEvent } from "../types/events";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "../supabase";

interface EventsStore {
  events: DBEvent[];
  isLoading: boolean;

  getEvents: () => Promise<void>;
  subscribeToEvents: () => void;
  unsubscribeToEvents: () => void;
}

let subscription: RealtimeChannel | null = null;

export const useEventsStore = create<EventsStore>((set, get) => ({
  events: [],
  isLoading: true,

  getEvents: async () => {
    const { data, error } = await supabase.from("events").select("*");

    if (error) {
      return;
    }

    const eventsFromData: DBEvent[] = [];

    data?.forEach((event) => {
      eventsFromData.push(event as unknown as DBEvent);
    });

    set({ events: eventsFromData, isLoading: false });

    return;
  },

  subscribeToEvents: () => {
    if (subscription) {
      return;
    }

    subscription = supabase
      .channel("events_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        (payload) => {
          set({ isLoading: true });

          const { events } = get();

          let updated = [...events];

          if (payload.eventType === "INSERT") {
            updated.push(payload.new as unknown as DBEvent);
          } else if (payload.eventType === "UPDATE") {
            updated = updated.map((event) =>
              event.id === payload.new.id
                ? (payload.new as unknown as DBEvent)
                : event
            );
          } else if (payload.eventType === "DELETE") {
            updated = updated.filter((event) => event.id !== payload.old.id);
          }

          set({ events: updated, isLoading: false });
        }
      )
      .subscribe();
  },
  unsubscribeToEvents: () => {
    if (subscription) {
      supabase.removeChannel(subscription);

      subscription = null;
    }
  },
}));
