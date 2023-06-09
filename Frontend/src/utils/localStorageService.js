import { ISSERVER } from "./is-server";

class LocalStorageService {
  setToken(token) {
    if (!ISSERVER) localStorage.setItem("token", token);
  }
  getToken() {
    if (ISSERVER) return null;
    return localStorage.getItem("token");
  }

  removeToken() {
    if (!ISSERVER) {
      localStorage.clear();
    }
  }
}

export const localStorageService = new LocalStorageService();
