import AvatarPlaceholder from "../assets/avatar_placeholder.jpg";

const ProfileAvatar = ({ photoUrl, alt = "Profile", className = "" }) => (
  <img
    src={photoUrl && photoUrl.trim() !== "" ? photoUrl : AvatarPlaceholder}
    alt={alt}
    className={className}
    referrerPolicy="no-referrer"
  />
);

export default ProfileAvatar;
