import React from "react";

const Profile = ({ profile_img_url, onClick }) => (
  <div className="flex items-center justify-center" onClick={onClick}>
    <img
      alt="Profile"
      className="h-12 w-12 rounded-full object-cover"
      src={profile_img_url}
    />
  </div>
);

export default Profile;
