import api from "../../api";

export const signIn = async (
  email: string,
  password: string,
  rememberMe: boolean
) => {
  const response = await api.auth.signIn(email, password, rememberMe);
  return response.data;
};
