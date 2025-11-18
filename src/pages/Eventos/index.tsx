import { useEffect, useState } from "react";

import type { DBEvent } from "../../types/db";
import { FlagBar } from "../../components/FlagBar";
import { OGTEvent } from "../../components/OGTEvent";
import { RegularPageLayout } from "../../layouts/RegularPage";
import { useEventsStore } from "../../store/events";

export function Eventos() {
  const [pastEvents, setPastEvents] = useState<DBEvent[]>([]);
  const [futureEvents, setFutureEvents] = useState<DBEvent[]>([]);

  const events = useEventsStore((s) => s.events);
  const isLoading = useEventsStore((s) => s.isLoading);
  const getEvents = useEventsStore((s) => s.getEvents);

  useEffect(() => {
    if (events.length !== 0) return;

    getEvents();
  }, []);

  useEffect(() => {
    const now = new Date();
    const past: DBEvent[] = [];
    const future: DBEvent[] = [];

    for (const event of events) {
      if (new Date(event.schedule_at) < now) {
        past.push(event);
      } else {
        future.push(event);
      }
    }

    setPastEvents(past);
    setFutureEvents(future);
  }, [events]);

  // TODO: add loading ui
  return (
    <RegularPageLayout>
      <h1 className="text-white text-5xl text-center">Eventos</h1>
      <FlagBar className="my-4 w-full md:w-2xs" />
      <div className="mt-12">
        <h2 className="mb-6 text-white text-4xl">Eventos Próximos</h2>
        <div className="space-y-4">
          {futureEvents.map((event) => (
            <OGTEvent key={event.id} event={event} />
          ))}
        </div>
      </div>
      <div className="mt-12">
        <h2 className="mb-6 text-white text-4xl">Eventos Pasados</h2>
        <div className="space-y-4">
          {pastEvents.map((event) => (
            <OGTEvent key={event.id} event={event} />
          ))}
        </div>
      </div>
    </RegularPageLayout>
  );
}
