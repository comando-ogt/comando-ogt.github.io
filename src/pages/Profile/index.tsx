import { useEffect, useState } from "react";

import AvatarUpload from "./AvatarUpload";
import { Button } from "../../components/Button";
import { FlagBar } from "../../components/FlagBar";
import { Navigate } from "react-router";
import { RegularPageLayout } from "../../layouts/RegularPage";
import { TextInput } from "../../components/TextInput";
import { getErrorMessage } from "../../utils/general";
import { supabase } from "../../supabase";
import { useAuthStore } from "../../store/auth";

export function Profile() {
  const [hllUsername, setHLLUsername] = useState("");
  const [hllLevel, setHLLLevel] = useState(0);
  const [discordUsername, setDiscordUsername] = useState("");
  const [bio, setBio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const profile = useAuthStore((state) => state.profile);

  if (!profile) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    if (!profile) return;

    setHLLUsername(profile.hll_username);
    setHLLLevel(profile.hll_level);
    setDiscordUsername(profile.discord_username);
    setBio(profile.bio);
  }, [profile]);

  async function updateProfile() {
    setLoading(true);

    try {
      if (!profile) {
        throw new Error("Profile not found");
      }

      const updates = {
        hll_username: hllUsername,
        hll_level: hllLevel,
        discord_username: discordUsername,
        bio: bio,
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", profile.user_id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      // TODO: create a better ui
      alert(getErrorMessage(error));
    }

    setLoading(false);
  }

  return (
    <RegularPageLayout>
      <h1 className="text-white text-5xl text-center">Editar Perfil</h1>
      <FlagBar className="my-4 w-full md:w-2xs" />
      <div className="flex flex-wrap gap-4">
        <AvatarUpload
          url={profile.avatar_url ?? "/logo.png"}
          onUpload={() => {}}
        />

        <form action={updateProfile} className="flex-1 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 space-y-2">
              <label className="block" htmlFor="hll_username">
                Nombre de usuario en Hell Let Loose:
              </label>
              <TextInput
                type="text"
                id="hll_username"
                name="hll_username"
                autoComplete="off"
                placeholder="Nombre de usuario en Hell Let Loose"
                value={hllUsername}
                onChange={(e) => setHLLUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block" htmlFor="hll_level">
                Nivel:
              </label>
              <TextInput
                type="number"
                name="hll_level"
                id="hll_level"
                required
                min="1"
                step={1}
                className="flex-1 !w-20"
                value={hllLevel}
                onChange={(e) => setHLLLevel(parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block" htmlFor="discord_username">
              Nombre de usuario en Discord:
            </label>
            <TextInput
              type="text"
              id="discord_username"
              name="discord_username"
              placeholder="Nombre de usuario en Discord"
              value={discordUsername}
              onChange={(e) => setDiscordUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block" htmlFor="hll_username">
              Biografía:
            </label>
            <textarea
              className="bg-neutral-800 p-2 border border-neutral-700 rounded focus:outline-0 w-full"
              value={bio ?? ""}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <Button>{loading ? "Actualizando..." : "Actualizar"}</Button>
          </div>
        </form>
      </div>
    </RegularPageLayout>
  );
}
