import { AxiosResponse } from "axios";
import BaseAPI from "./base";

export class AuthAPI extends BaseAPI {
  signIn(
    email: string,
    password: string,
    remember_me: boolean
  ): Promise<AxiosResponse> {
    const data = { user: { email, password, remember_me } };
    return this.client.post("users/sign_in", data);
  }
}

export default AuthAPI;
