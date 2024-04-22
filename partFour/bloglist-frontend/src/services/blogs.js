import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};
const getAll = async () => {
  const res = await axios.get(baseUrl);
  return res.data;
};

const createBlog = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const res = await axios.post(baseUrl, newObject, config);
  return res.data;
};

const likeBlog = async (updatedObj, id) => {
  const res = await axios.put(`${baseUrl}/${id}`, updatedObj);
  return res.data;
};

const removeBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const res = await axios.delete(`${baseUrl}/${id}`, config);
  return res.data;
};

export default { getAll, createBlog, setToken, likeBlog, removeBlog };
