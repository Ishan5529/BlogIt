import axios from "axios";

const login = payload =>
  axios.post("/session", {
    login: payload,
  });

const logout = () => axios.delete(`/session`);

const signup = payload =>
  axios.post("/users", {
    user: { ...payload, organization_id: 1 },
  });

const authApi = {
  login,
  signup,
  logout,
};

export default authApi;
