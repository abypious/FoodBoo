import { create } from "zustand";
import API from "../api/axiosConfig";

const useBookingStore = create((set) => ({

  getMyBookings: async () => {
    const res = await API.get("/api/bookings/my");
    return res.data.data;
  },

  createBooking: async (body) => {
    const res = await API.post("/api/bookings", body);
    return res.data.data;
  },

  cancelBooking: async (id) => {
    const res = await API.put(`/api/bookings/cancel/${id}`);
    return res.data.data;
  },

  // FIXED: bookingId, not foodId
  addReview: async (bookingId, rating, comment) => {
    const res = await API.post(`/api/reviews/${bookingId}`, {
      rating,
      comment
    });
    return res.data.data;
  },

  updateReview: async (reviewId, rating, comment) => {
    const res = await API.put(`/api/reviews/${reviewId}`, {
      rating,
      comment
    });
    return res.data.data;
  }

}));

export default useBookingStore;
