"use client";

import { Camera, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { validateAvatar } from "../lib/profile";

type AvatarEditorProps = {
  avatarUrl: string | null;
  onChange: (file: File) => void;
};

export function AvatarEditor({ avatarUrl, onChange }: AvatarEditorProps) {
  const [previewUrl, setPreviewUrl] = useState(avatarUrl);
  const [temporaryUrl, setTemporaryUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => () => {
    if (temporaryUrl) URL.revokeObjectURL(temporaryUrl);
  }, [temporaryUrl]);

  function selectPhoto(file?: File) {
    if (!file) return;
    const validationError = validateAvatar(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (temporaryUrl) URL.revokeObjectURL(temporaryUrl);
    const nextPreview = URL.createObjectURL(file);
    setTemporaryUrl(nextPreview);
    setPreviewUrl(nextPreview);
    setError("");
    onChange(file);
  }

  return (
    <div className="avatar-editor">
      <div
        className="avatar-preview"
        style={previewUrl ? { backgroundImage: `url("${previewUrl}")` } : undefined}
        role="img"
        aria-label="Aperçu de la photo de profil"
      >
        {!previewUrl && <UserRound aria-hidden="true" />}
      </div>
      <div>
        <label className="avatar-button">
          <Camera aria-hidden="true" />
          Choisir une photo
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label="Choisir une photo"
            onChange={(event) => selectPhoto(event.target.files?.[0])}
          />
        </label>
        <p>JPG, PNG ou WebP · 2 Mo maximum</p>
        {error && <p className="form-error" role="alert">{error}</p>}
      </div>
    </div>
  );
}
