import { client } from "./client";

export default class BaseAPI {
  get client() {
    return client;
  }
}
