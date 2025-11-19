import { create } from "zustand";
import API from "../api/axiosConfig";

const useFoodStore = create((set) => ({
  foods: [],
  food: null,
  loading: false,

  // Load foods by category
  fetchFoodsByCategory: async (categoryId) => {
    set({ loading: true });
    const url = categoryId
      ? `/api/foods/category/${categoryId}`
      : "/api/foods";

    const res = await API.get(url);

    set({
      foods: res.data.data ?? res.data,
      loading: false,
    });
  },

  fetchFoodById: async (id) => {
    set({ loading: true });

    const res = await API.get(`/api/foods/${id}`);

    set({
      food: res.data.data ?? res.data,
      loading: false,
    });
  },
}));

export default useFoodStore;
