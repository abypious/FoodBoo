import { create } from "zustand";
import API from "../api/axiosConfig";
import jwtDecode from "jwt-decode";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: true,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const res = await API.post("/api/auth/login", { email, password });

      const token = res.data.data.token;
      const decoded = jwtDecode(token);

      const user = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.sub,
        role: decoded.role,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, token, loading: false });
      return user;
    } catch (err) {
      set({ loading: false, error: "Invalid credentials" });
      throw err;
    }
  },

  logout: () => {
    localStorage.clear();
    set({ user: null, token: null, loading: false });
  },

  initialize: () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      // Always set loading to false
      if (!token || !userStr) {
        set({ loading: false });
        return;
      }

      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch {
        // token malformed → kill session
        localStorage.clear();
        set({ loading: false });
        return;
      }

      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        // token expired
        localStorage.clear();
        set({ loading: false });
        return;
      }

      const user = JSON.parse(userStr);

      set({ token, user, loading: false });

    } catch (err) {
      console.error("Failed to initialize auth:", err);
      localStorage.clear();
      set({ loading: false });
    }
  },
}));

export default useAuthStore;
