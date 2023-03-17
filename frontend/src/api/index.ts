import AuthAPI from "./auth";

const api = {
  auth: new AuthAPI(),
};

Object.freeze(api);

export default api;
