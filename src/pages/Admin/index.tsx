import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

import { Button } from "../../components/Button";
import type { DBEvent } from "../../types/db";
import { EventModal } from "../../modals/Event";
import { FlagBar } from "../../components/FlagBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "../../components/Link";
import { Navigate } from "react-router";
import { OGTEvent } from "../../components/OGTEvent";
import { RegularPageLayout } from "../../layouts/RegularPage";
import { supabase } from "../../supabase";
import { useAuthStore } from "../../store/auth";
import { useEventsStore } from "../../store/events";
import { useMembersStore } from "../../store/members";

export function Admin() {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState<DBEvent | undefined>(undefined);

  const members = useMembersStore((s) => s.members);
  const membersLoading = useMembersStore((s) => s.isLoading);
  const getMembers = useMembersStore((s) => s.getMembers);
  const subscribeToMembers = useMembersStore((s) => s.subscribeToMembers);

  const events = useEventsStore((s) => s.events);
  const eventsLoading = useEventsStore((s) => s.isLoading);
  const getEvents = useEventsStore((s) => s.getEvents);
  const subscribeToEvents = useEventsStore((s) => s.subscribeToEvents);

  const profile = useAuthStore((s) => s.profile);

  useEffect(() => {
    if (members.length === 0) {
      getMembers();
    }

    if (events.length === 0) {
      getEvents();
    }

    subscribeToMembers();
    subscribeToEvents();
  }, []);

  if (!profile || profile?.web_role !== "admin") {
    return <Navigate to="/404" replace />;
  }

  return (
    <RegularPageLayout>
      <h1 className="text-white text-5xl text-center">Panel de Admin</h1>
      <FlagBar className="my-4 w-full md:w-2xs" />

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-staatliches text-white text-4xl">Miembros</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {membersLoading && (
            <>
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 bg-neutral-950 p-3 rounded-lg min-w-3xs min-h-24 animate-pulse"
                />
              ))}
            </>
          )}
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center gap-2 bg-neutral-950 p-3 rounded-lg min-w-3xs"
            >
              <Link to={`/miembro/${member.url}`}>{member.name}</Link>
              <div className="flex gap-2">
                <Button variant="gray">
                  <FontAwesomeIcon icon={faPencil} />
                </Button>

                <Button variant="red">
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-staatliches text-white text-4xl">Eventos</h2>

          <Button
            variant="green"
            onClick={() => {
              setModalEvent(undefined);
              setIsEventModalOpen(true);
            }}
          >
            Agregar Evento
          </Button>
        </div>
        <div className="space-y-2">
          {eventsLoading && (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex gap-2 bg-neutral-950 rounded min-h-30 animate-pulse"
                />
              ))}
            </>
          )}

          {events.map((event) => (
            <div key={event.id} className="flex gap-2 rounded">
              <OGTEvent event={event} className="flex-1" full />
              <div className="flex flex-col justify-center gap-2">
                <Button
                  variant="gray"
                  onClick={() => {
                    setModalEvent(event);
                    setIsEventModalOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPencil} />
                </Button>

                <Button
                  variant="red"
                  onClick={async () => {
                    const response = await supabase
                      .from("events")
                      .delete()
                      .eq("id", event.id);

                    if (response.status === 204) {
                      // TODO: create a better ui
                      alert("Evento eliminado con éxito.");
                    } else {
                      // TODO: create a better ui
                      alert("Error al eliminar evento.");
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EventModal
        event={modalEvent}
        isOpen={isEventModalOpen}
        onOpenChange={setIsEventModalOpen}
      />
    </RegularPageLayout>
  );
}
