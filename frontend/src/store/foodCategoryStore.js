import { create } from "zustand";
import API from "../api/axiosConfig";

const useFoodCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await API.get("/api/categories");
      set({ categories: res.data.data, loading: false });
    } catch (err) {
      set({ loading: false, error: "Failed to load categories" });
    }
  },
}));

export default useFoodCategoryStore;
