const setToLocalStorage = ({
  authToken,
  email,
  userId,
  userName,
  profileImg = null,
}) => {
  localStorage.setItem("authToken", JSON.stringify(authToken));
  localStorage.setItem("authEmail", JSON.stringify(email));
  localStorage.setItem("authUserId", JSON.stringify(userId));
  localStorage.setItem("authUserName", JSON.stringify(userName));
  localStorage.setItem("authUserName", JSON.stringify(userName));
  localStorage.setItem("authProfileImageUrl", JSON.stringify(profileImg));
};

const getFromLocalStorage = key => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};

export { setToLocalStorage, getFromLocalStorage };
