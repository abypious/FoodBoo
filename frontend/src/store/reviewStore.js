import { create } from "zustand";
import API from "../api/axiosConfig";

const useReviewStore = create(() => ({
  
  getMyReviews: async () => {
    const res = await API.get("/api/reviews/my");
    return res.data.data;
  },

  deleteReview: async (id) => {
    const res = await API.delete(`/api/reviews/${id}`);
    return res.data.data;
  },

  updateReview: async (id, rating, comment) => {
    const res = await API.put(`/api/reviews/${id}`, { rating, comment });
    return res.data.data;
  }

}));

export default useReviewStore;
