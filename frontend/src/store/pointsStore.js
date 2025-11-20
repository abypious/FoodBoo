import { create } from "zustand";
import API from "../api/axiosConfig";

const usePointsStore = create(() => ({
  getMyPoints: async () => {
    const res = await API.get("/api/points/my");
    return res.data.data ?? res.data;
  },
}));

export default usePointsStore;
