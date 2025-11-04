import { useEffect, useState, type FormEvent } from "react";
import { Dialog, DialogClose, DialogContent } from "../components/Dialog";

import { motion } from "motion/react";
import { Label } from "radix-ui";
import { Button } from "../components/Button";
import { TextInput } from "../components/TextInput";
import { supabase } from "../supabase";
import type { DBEvent } from "../types/events";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface Props {
  event?: DBEvent;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventModal({ event, isOpen, onOpenChange }: Props) {
  const [title, setTitle] = useState("");
  const [opponent, setOpponent] = useState("");
  const [opponentLogo, setOpponentLogo] = useState("");
  const [type, setType] = useState("");
  const [teamScore, setTeamScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [map, setMap] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      const dt = new Date(event.schedule_at);
      const year = dt.getFullYear();
      const month = String(dt.getMonth() + 1).padStart(2, "0");
      const day = String(dt.getDate()).padStart(2, "0");
      const hours = String(dt.getHours()).padStart(2, "0");
      const mins = String(dt.getMinutes()).padStart(2, "0");

      const localTime = `${year}-${month}-${day}T${hours}:${mins}`;

      setTitle(event.title);
      setOpponent(event.opponent);
      setOpponentLogo(event.opponent_logo ?? "");
      setType(event.type);
      setTeamScore(event.team_score);
      setOpponentScore(event.opponent_score);
      setMap(event.map ?? "");
      setDateTime(localTime);
      setNotes(event.notes);
    }
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const eventData = {
      title,
      opponent,
      opponent_logo: opponentLogo,
      type,
      team_score: teamScore,
      opponent_score: opponentScore,
      map,
      schedule_at: new Date(dateTime).toISOString(),
      notes,
    };

    if (event) {
      const { error } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", event.id);

      if (error) {
        // TODO: create a better ui
        alert("Error updating event");
      } else {
        // TODO: create a better ui
        alert("Event updated successfully");
      }
    } else {
      const { error } = await supabase.from("events").insert(eventData);

      if (error) {
        // TODO: create a better ui
        alert("Error inserting event");
      } else {
        // TODO: create a better ui
        alert("Event inserted successfully");
      }
    }

    setLoading(false);
  }

  return (
    <Dialog modal open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        title={!event ? "Crear nuevo evento" : "Editar event"}
        description="evento"
        className="max-h-3/4 overflow-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} initial="hidden" animate="show">
            <TextInput
              type="text"
              name="title"
              required
              placeholder="Titulo de evento"
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </motion.div>

          <motion.div variants={item} initial="hidden" animate="show">
            <TextInput
              type="text"
              name="opponent"
              required
              placeholder="Oponente"
              defaultValue={opponent}
              onChange={(e) => setOpponent(e.target.value)}
            />
          </motion.div>

          <motion.div variants={item} initial="hidden" animate="show">
            <TextInput
              type="text"
              name="opponent_logo"
              placeholder="Logo de oponente"
              defaultValue={opponentLogo}
              onChange={(e) => setOpponentLogo(e.target.value)}
            />
          </motion.div>

          <motion.div variants={item} initial="hidden" animate="show">
            <TextInput
              type="text"
              name="type"
              placeholder="Tipo de juego"
              defaultValue={type}
              onChange={(e) => setType(e.target.value)}
            />
          </motion.div>

          {event && (
            <>
              <motion.div
                variants={item}
                initial="hidden"
                animate="show"
                className="flex items-center gap-2"
              >
                <Label.Root htmlFor="teamScore">Puntaje del Equipo:</Label.Root>
                <TextInput
                  type="number"
                  name="team_score"
                  id="teamScore"
                  defaultValue={teamScore}
                  min={0}
                  max={5}
                  step={1}
                  className="flex-1 !w-20"
                  onChange={(e) => setTeamScore(parseInt(e.target.value))}
                />
              </motion.div>
              <motion.div
                variants={item}
                initial="hidden"
                animate="show"
                className="flex items-center gap-2"
              >
                <Label.Root htmlFor="opponentScore">
                  Puntaje del Oponente:
                </Label.Root>
                <TextInput
                  type="number"
                  name="opponent_score"
                  id="opponentScore"
                  defaultValue={opponentScore}
                  min={0}
                  max={5}
                  step={1}
                  className="flex-1 !w-20"
                  onChange={(e) => setOpponentScore(parseInt(e.target.value))}
                />
              </motion.div>
            </>
          )}

          <motion.div variants={item} initial="hidden" animate="show">
            <TextInput
              type="text"
              name="map"
              placeholder="Mapa"
              defaultValue={map}
              onChange={(e) => setMap(e.target.value)}
            />
          </motion.div>

          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            className="flex items-center gap-2"
          >
            <Label.Root htmlFor="date">Fecha:</Label.Root>
            <TextInput
              type="datetime-local"
              defaultValue={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="flex-1 !w-20"
            />
          </motion.div>

          <motion.div variants={item} initial="hidden" animate="show">
            <Button
              type="submit"
              variant="green"
              disabled={loading}
              className="w-full"
            >
              {loading
                ? "VERIFICANDO..."
                : !event
                ? "Crear Evento"
                : "Actualizar Evento"}
            </Button>
          </motion.div>

          <motion.div variants={item} initial="hidden" animate="show">
            <DialogClose asChild>
              <Button variant="red" disabled={loading} className="w-full">
                Cancelar
              </Button>
            </DialogClose>
          </motion.div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
