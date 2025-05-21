import AvatarPlaceholder from "../assets/avatar_placeholder.jpg";

const ProfileAvatar = ({ userData, alt = "Profile" }) => (
  <img
    src={userData.photoUrl ? userData.photoUrl : AvatarPlaceholder}
    alt={alt}
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
