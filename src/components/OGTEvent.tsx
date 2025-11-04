import type { DBEvent } from "../types/events";
import clsx from "clsx";
import { es } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";

interface Props {
  event: DBEvent;
  className?: string;
  full?: boolean;
}

export function OGTEvent({ event, className, full }: Props) {
  const isVictory = event.team_score > event.opponent_score;
  const isUndeterminedOrDraw = event.team_score === event.opponent_score;

  return (
    <motion.div
      className={clsx(
        "bg-neutral-950",
        "p-4",
        "rounded-lg",
        "border-l-4",
        isVictory
          ? "border-ogt-green"
          : isUndeterminedOrDraw
          ? "border-yellow-500"
          : "border-ogt-red",
        className
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.2,
            duration: 0.25,
          },
        },
      }}
    >
      <div className="flex flex-row justify-between">
        <div>
          <p className="font-bold text-white text-lg">{event.title}</p>
          <p className="text-gray-300">vs. {event.opponent}</p>
        </div>
        {!isUndeterminedOrDraw && (
          <span
            className={clsx(
              "mt-2",
              "sm:mt-0",
              "px-3",
              "py-1",
              "text-sm",
              "font-bold",
              "rounded-full",
              "self-start",
              "sm:self-center",
              isVictory ? "text-ogt-green" : "text-ogt-red"
            )}
          >
            {event.team_score}-{event.opponent_score}
          </span>
        )}
      </div>
      <div className="flex flex-wrap space-x-4 mt-2 text-gray-400 text-sm">
        <span title={new Date(event.schedule_at).toLocaleDateString()}>
          {formatDistanceToNow(event.schedule_at, {
            locale: es,
            addSuffix: true,
          })}
        </span>
        <span>|</span>
        <span>{event.type}</span>
        <span>|</span>
        <span>Mapa: {event.map}</span>
        {full && (
          <>
            <span>|</span>
            <span title={new Date(event.created_at).toLocaleDateString()}>
              Creado:{" "}
              {formatDistanceToNow(event.created_at, {
                locale: es,
                addSuffix: true,
              })}
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
}
