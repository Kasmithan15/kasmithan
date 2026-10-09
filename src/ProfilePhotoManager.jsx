import { ArrowLeft, ImagePlus, LoaderCircle, LockKeyhole, LogOut } from "lucide-react";
import React, { useEffect, useState } from "react";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

export default function ProfilePhotoManager() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/profile-auth", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Could not check upload access.");
        }
        if (active) {
          setAuthenticated(result.authenticated);
          setConfigured(result.configured);
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!photo) {
      setPreviewUrl("");
      return undefined;
    }
    const objectUrl = URL.createObjectURL(photo);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const signIn = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/profile-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not sign in.");
      setAuthenticated(true);
      setPassword("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const uploadPhoto = async (event) => {
    event.preventDefault();
    if (!photo) {
      setError("Choose an image first.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("image", photo);
      const response = await fetch("/api/profile-photo", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not upload the image.");
      setMessage("Profile photo updated.");
      setPhoto(null);
      window.dispatchEvent(new Event("profile-photo-updated"));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/profile-auth", { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not sign out.");
      setAuthenticated(false);
      setMessage("Signed out.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const selectPhoto = (event) => {
    const selected = event.target.files?.[0] || null;
    setError("");
    setMessage("");
    if (selected && selected.size > MAX_FILE_SIZE) {
      setPhoto(null);
      setError("Choose an image smaller than 4 MB.");
      event.target.value = "";
      return;
    }
    setPhoto(selected);
  };

  return (
    <main className="photo-manager">
      <a className="photo-manager-back" href="/"><ArrowLeft size={16} /> Back to portfolio</a>
      <section className="photo-manager-panel">
        <div className="section-label">PROFILE SETTINGS</div>
        <h1>Manage your profile photo<span className="accent">.</span></h1>
        <p className="photo-manager-intro">Upload a JPEG, PNG, or WebP image up to 4 MB. Your photo will appear on the portfolio.</p>

        {checking ? (
          <p className="photo-manager-message" role="status">Checking upload access…</p>
        ) : !configured ? (
          <div className="photo-manager-message" role="alert">
            Photo uploads aren’t configured yet. Follow the Vercel Blob and environment-variable setup in the project README.
          </div>
        ) : !authenticated ? (
          <form className="photo-manager-form" onSubmit={signIn}>
            <label htmlFor="upload-password">Upload password</label>
            <div className="photo-manager-input">
              <LockKeyhole size={17} aria-hidden="true" />
              <input
                id="upload-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <button className="button button-primary" type="submit" disabled={busy}>
              {busy ? <LoaderCircle className="spin" size={16} /> : <LockKeyhole size={16} />}
              Sign in to manage photo
            </button>
          </form>
        ) : (
          <form className="photo-manager-form" onSubmit={uploadPhoto}>
            <label htmlFor="profile-photo-file">Choose a new photo</label>
            <input
              id="profile-photo-file"
              className="visually-hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={selectPhoto}
            />
            <label className="photo-file-picker" htmlFor="profile-photo-file">
              {previewUrl ? <img src={previewUrl} alt="Selected image preview" /> : <ImagePlus size={27} />}
              <span>{photo ? photo.name : "Select a JPEG, PNG, or WebP image"}</span>
            </label>
            <button className="button button-primary" type="submit" disabled={busy || !photo}>
              {busy ? <LoaderCircle className="spin" size={16} /> : <ImagePlus size={16} />}
              Upload profile photo
            </button>
            <button className="button button-quiet" type="button" onClick={signOut} disabled={busy}>
              <LogOut size={16} /> Sign out
            </button>
          </form>
        )}

        {error && <p className="photo-manager-error" role="alert">{error}</p>}
        {message && <p className="photo-manager-success" role="status">{message}</p>}
      </section>
    </main>
  );
}
