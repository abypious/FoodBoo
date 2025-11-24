import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import useAuthStore from "./store/authStore";

import { Toaster } from "react-hot-toast";

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);
  const loading = useAuthStore((s) => s.loading);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "var(--color-bg)",
          },
        }}
      />

      <AppRoutes />
    </>
  );
}
