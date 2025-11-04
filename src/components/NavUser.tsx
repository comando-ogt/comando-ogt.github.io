import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";

import { Avatar } from "./Avatar";
import { supabase } from "../supabase";
import { useAuthStore } from "../store/auth";
import { useEventsStore } from "../store/events";
import { useMembersStore } from "../store/members";
import { useNavigate } from "react-router";

export function NavUser() {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="!h-8 all-unset">
          <Avatar src="" name="" size="xs" className="cursor-pointer" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => {
            navigate(`/miembro/${profile.member_url}`);
          }}
        >
          Perfil
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => {
            navigate("/perfil");
          }}
        >
          Editar Perfil
        </DropdownMenuItem>

        {profile.web_role === "admin" && (
          <DropdownMenuItem
            onSelect={() => {
              navigate("/admin");
            }}
          >
            Panel de Admin
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            supabase.auth.signOut();

            unsubscribeToMembers();
            unsubscribeToEvents();

            navigate("/");
          }}
        >
          Logout
        </DropdownMenuItem>
        <DropdownMenuArrow />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
