import AvatarPlaceholder from "../assets/avatar_placeholder.jpg";

const ProfileAvatar = ({ photoUrl, alt = "Profile", className = "" }) => (
  <img
    src={photoUrl && photoUrl.trim() !== "" ? photoUrl : AvatarPlaceholder}
    alt={alt}
    className={className}
    referrerPolicy="no-referrer"
    style={{
      width: 48,
      height: 48,
      borderRadius: "50%",
      objectFit: "cover",
      border: "1px solid #ccc",
    }}
  />
);

export default ProfileAvatar;
