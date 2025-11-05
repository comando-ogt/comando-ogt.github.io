import { FlagBar } from "../../components/FlagBar";
import { ListMemberCard } from "./ListMemberCard";
import { RegularPageLayout } from "../../layouts/RegularPage";
import { useEffect } from "react";
import { useMembersStore } from "../../store/members";

export function Members() {
  const members = useMembersStore((s) => s.members);
  const activeMembers = useMembersStore((s) => s.activeMembers);
  const isLoading = useMembersStore((s) => s.isLoading);
  const getMembers = useMembersStore((s) => s.getMembers);

  useEffect(() => {
    if (members.length !== 0) return;

    getMembers();
  }, []);

  // TODO: add loading ui
  return (
    <RegularPageLayout>
      <h1 className="text-white text-5xl text-center">Miembros</h1>
      <FlagBar className="my-4 w-full md:w-2xs" />
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-12">
        {activeMembers.map((member) => (
          <ListMemberCard key={member.url} member={member} />
        ))}
      </div>
    </RegularPageLayout>
  );
}
