import axios from "axios";

const baseUrl = "/api/notes";

const getAll = () => {
  const request = axios.get(baseUrl);
  const hardcodedNote = {
    id: 1000,
    content: "This is a FAKE note, NOT saved to server",
    important: true,
  };
  return request.then((res) => res.data.concat(hardcodedNote));
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((res) => res.data);
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((res) => res.data);
};

export default {
  getAll: getAll,
  create: create,
  update: update,
};
