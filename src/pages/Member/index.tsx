import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router";
import { RegularPageLayout } from "../../layouts/RegularPage";
import { useMembersStore } from "../../store/members";
import type { Member } from "../../types/members";
import { Loading } from "./Loading";
import { Profile } from "./Profile";

export function Member() {
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<Member | null>(null);

  const members = useMembersStore((s) => s.members);
  const isLoading = useMembersStore((s) => s.isLoading);
  const getMembers = useMembersStore((s) => s.getMembers);

  const { memberUrl } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (members.length !== 0) return;

    getMembers();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const member = members.find((m) => m.url === memberUrl);

    // TODO: reroute to a page showing that the member was not found
    if (!member) {
      navigate("/404");

      return;
    }

    setMember(member);
    setLoading(false);
  }, [members]);

  return (
    <RegularPageLayout>
      {loading && <Loading />}
      {member && <Profile member={member} />}
    </RegularPageLayout>
  );
}
