import { useEffect, useState } from "react";

import { Button } from "../../components/Button";
import type { DBEvent } from "../../types/events";
import { EventModal } from "../../modals/Event";
import { FlagBar } from "../../components/FlagBar";
import { Navigate } from "react-router";
import { OGTEvent } from "../../components/OGTEvent";
import { RegularPageLayout } from "../../layouts/RegularPage";
import { supabase } from "../../supabase";
import { useAuthStore } from "../../store/auth";

export function AdminPage() {
  const [events, setEvents] = useState<DBEvent[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState<DBEvent | undefined>(undefined);

  const profile = useAuthStore((s) => s.profile);

  useEffect(() => {
    getEvents();
  }, []);

  async function getEvents() {
    const { data } = await supabase.from("events").select();

    setEvents(data as unknown as DBEvent[]);
  }

  if (!profile || profile?.web_role !== "admin") {
    return <Navigate to="/404" replace />;
  }

  return (
    <RegularPageLayout>
      <h1 className="text-white text-5xl text-center">Admin Dashboard</h1>
      <FlagBar className="my-4 w-full md:w-2xs" />

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-staatliches text-white text-4xl">Miembros</h2>
        </div>
        <div className="space-y-2">
          {/* {members.map(member => (
                                <div key={member.name} className="flex justify-between items-center bg-black/30 p-3 rounded-lg">
                                    <span>{member.name} - ({member.role})</span>
                                    <button onClick={() => handleRemoveMember(member.name)} className="text-red-500 hover:text-red-400">Remove</button>
                                </div>
                            ))} */}
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
                  Editar
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

                      getEvents();
                    } else {
                      // TODO: create a better ui
                      alert("Error al eliminar evento.");
                    }
                  }}
                >
                  Borrar
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
