import { NavLink } from "./NavLink";
import { supabase } from "../supabase";
import { useAuthStore } from "../store/auth";
import { useEventsStore } from "../store/events";
import { useMembersStore } from "../store/members";
import { useNavigate } from "react-router";

interface Props {
  className?: string;
}

export function NavUserLinks({ className }: Props) {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const isLoading = useAuthStore((s) => s.isLoading);

  const unsubscribeToMembers = useMembersStore((s) => s.unsubscribeToMembers);
  const unsubscribeToEvents = useEventsStore((s) => s.unsubscribeToEvents);

  const navigate = useNavigate();

  if (user === null || profile === null || isLoading) {
    return null;
  }

  return (
    <>
      <div className="my-4 border-neutral-500 border-b w-100% h-[1px]" />

      <NavLink to={`/miembro/${profile.member_url}`} className={className}>
        Perfil
      </NavLink>

      <NavLink to="/perfil" className={className}>
        Editar Perfil
      </NavLink>

      {profile.web_role === "admin" && (
        <NavLink to="/admin" className={className}>
          Panel de Admin
        </NavLink>
      )}

      <div className="my-4 border-neutral-500 border-b w-100% h-[1px]" />

      <div
        className="text-gray-300 hover:text-white transition cursor-pointer"
        onClick={() => {
          supabase.auth.signOut();

          unsubscribeToMembers();
          unsubscribeToEvents();

          navigate("/");
        }}
      >
        Logout
      </div>
    </>
  );
}
