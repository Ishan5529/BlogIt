import axios from "axios";

const fetch = () => axios.get("/categories");

const show = name => axios.get(`/categories/${name}`);

const create = payload =>
  axios.post("/categories/", {
    category: payload,
  });

const categoriesApi = { fetch, show, create };

export default categoriesApi;
