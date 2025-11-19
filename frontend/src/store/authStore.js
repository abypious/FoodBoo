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
    console.log("LOGIN RESPONSE:", res.data);  

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
    console.error("LOGIN ERROR:", err.response?.data || err);
    set({ loading: false, error: "Invalid credentials" });
    throw err;
  }
},

  logout: () => {
    localStorage.clear();
    set({ user: null, token: null });
  },

  initialize: () => {
    try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (!token || !userStr) return;

        const user = JSON.parse(userStr);

        // Restore state
        set({
        token,
        user,
        loading: false
        });

    } catch (err) {
        console.error("Failed to initialize store:", err);
        localStorage.clear();
    }
    },

}));

export default useAuthStore;
