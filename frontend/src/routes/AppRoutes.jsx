import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminRoutes from "./AdminRoutes";
import EmployeeRoutes from "./EmployeeRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee/*"
        element={
          <ProtectedRoute allowedRoles={["ROLE_EMPLOYEE"]}>
            <EmployeeRoutes />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  );
}
