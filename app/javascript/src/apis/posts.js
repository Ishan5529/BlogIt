import axios from "axios";

const fetch = params => axios.get("/posts", { params });

const show = slug => axios.get(`/posts/${slug}`);

const create = payload =>
  axios.post("/posts/", {
    post: payload,
  });

const update = ({ quiet = false, slug, payload }) =>
  axios.put(`/posts/${slug}${quiet ? "?quiet" : ""}`, {
    post: payload,
  });

const destroy = ({ slug, quiet }) =>
  axios.delete(`/posts/${slug}${quiet ? "?quiet" : ""}`);

const generatePdf = slug => axios.post(`/posts/${slug}/blogpost`, {});

const download = slug =>
  axios.get(`/posts/${slug}/blogpost/download`, { responseType: "blob" });

const postsApi = {
  fetch,
  show,
  create,
  update,
  destroy,
  generatePdf,
  download,
};

export default postsApi;
