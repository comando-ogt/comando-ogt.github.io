import { useState, type ChangeEvent } from "react";
import { useAuthStore } from "../../store/auth";
import { supabase } from "../../supabase";
import { getButtonStyles } from "../../utils/button";
import { getErrorMessage } from "../../utils/general";

interface Props {
  url: string;
  onUpload: (file: string) => void;
}

export default function AvatarUpload({ url, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);

  const profile = useAuthStore((s) => s.profile);

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length < 0) {
        throw new Error("Tienes que seleccionar una imagen.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      if (profile && profile.avatar_url) {
        if (profile.avatar_url !== "") {
          const { error: deleteError } = await supabase.storage
            .from("avatars")
            .remove([profile.avatar_url]);

          if (deleteError) {
            throw deleteError;
          }
        }
      }

      onUpload(fileName);
    } catch (error) {
      // TODO: create a better ui
      alert(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <img
        src={url}
        alt="Avatar"
        className="border-2 border-neutral-950 w-24 h-24"
      />
      <div className="w-24">
        <label className={getButtonStyles("green", "block")} htmlFor="avatar">
          {uploading ? "Cambiando..." : "Cambiar"}
        </label>
        <input
          className="hidden absolute"
          type="file"
          id="avatar"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
