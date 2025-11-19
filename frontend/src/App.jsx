import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import useAuthStore from "./store/authStore";

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);
  const loading = useAuthStore((s) => s.loading);

  useEffect(() => {
    initialize();
  }, []);

  return <AppRoutes />;
}
