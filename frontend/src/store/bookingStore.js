import { create } from "zustand";
import API from "../api/axiosConfig";

const useBookingStore = create((set) => ({
  creating: false,

  createBooking: async ({ foodId, date, timeSlot }) => {
    set({ creating: true });
    try {
      const res = await API.post("/api/bookings", {
        foodId,
        date,
        timeSlot,
      });
      set({ creating: false });
      return res.data.data;
    } catch (err) {
      set({ creating: false });
      throw err;
    }
  },
}));

export default useBookingStore;
