import axios from "axios";

const fetchVoteStatus = async ({ slug }) => {
  const response = await axios.get(`/posts/${slug}/vote`);

  return response.data;
};

const create = ({ slug, voteType }) =>
  axios.post(`/posts/${slug}/vote`, { vote_type: voteType });

const destroy = ({ slug }) => axios.delete(`/posts/${slug}/vote`);

const votesApi = {
  fetchVoteStatus,
  create,
  destroy,
};

export default votesApi;
