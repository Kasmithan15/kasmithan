import { UserRound } from "lucide-react";
import React, { useEffect, useState } from "react";
import "./profile-photo.css";

export default function ProfilePhoto() {
  const [photoUrl, setPhotoUrl] = useState("/profile-photo.jpg");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const loadPhoto = () => fetch("/api/profile-photo", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not load the profile photo.");
        }
        return response.json();
      })
      .then(({ url, uploadedAt }) => {
        if (active) {
          setPhotoUrl(url ? `${url}?v=${Date.parse(uploadedAt) || Date.now()}` : "/profile-photo.jpg");
          setFailed(false);
        }
      })
      .catch(() => {
        if (active) {
          setPhotoUrl("/profile-photo.jpg");
          setFailed(false);
        }
      });

    loadPhoto();
    window.addEventListener("profile-photo-updated", loadPhoto);
    return () => {
      active = false;
      window.removeEventListener("profile-photo-updated", loadPhoto);
    };
  }, []);

  return (
    <div className="profile-photo" aria-label={photoUrl ? "Kasmithan's profile photo" : "Profile photo placeholder"}>
      {photoUrl && !failed ? (
        <img
          src={photoUrl}
          alt="Kasmithan"
          onError={() => {
            if (photoUrl !== "/profile-photo.jpg") setPhotoUrl("/profile-photo.jpg");
            else setFailed(true);
          }}
        />
      ) : (
        <span className="profile-photo-placeholder">
          <UserRound size={25} aria-hidden="true" />
          <span>Your photo</span>
        </span>
      )}
    </div>
  );
}
