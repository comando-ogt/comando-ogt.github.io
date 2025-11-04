import { useEffect, useState } from "react";

import { FlagBar } from "../../components/FlagBar";
import { HomeMemberCard } from "./HomeMemberCard";
import { Link } from "../../components/Link";
import type { Member } from "../../types/members";
import { motion } from "motion/react";
import { useMembersStore } from "../../store/members";

export function MembersSection() {
  const [members, setMembers] = useState<Member[]>([]);

  const dbMembers = useMembersStore((s) => s.members);
  const isLoading = useMembersStore((s) => s.isLoading);
  const getMembers = useMembersStore((s) => s.getMembers);
  const getRandomMembers = useMembersStore((s) => s.getRandomMembers);

  useEffect(() => {
    if (members.length !== 0) return;

    getMembers();
  }, []);

  useEffect(() => {
    setMembers(getRandomMembers(8));
  }, [dbMembers]);

  // TODO: add loading ui
  return (
    <section id="members" className="py-20">
      <div className="mx-auto px-6 container">
        <h2 className="text-white text-4xl text-center">Comando Central</h2>
        <FlagBar />
        <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-12">
          {members.map((member) => (
            <HomeMemberCard key={member.url} member={member} />
          ))}
        </div>
      </div>
      <motion.div
        className="flex justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { delay: 0.5, duration: 0.25 },
          },
        }}
      >
        <Link className="mx-auto mt-12 py-4" to="/miembros" asButton>
          Ver el resto del equipo
        </Link>
      </motion.div>
    </section>
  );
}
