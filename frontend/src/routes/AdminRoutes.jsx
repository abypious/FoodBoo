import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout/AdminLayout";

import AdminDashboard from "../pages/Admin/Dashboard";
import Booking from "../pages/Admin/Booking";
import Reviews from "../pages/Admin/foodreview/Reviews";

// categories
import CategoriesList from "../pages/Admin/Categories/Categories";
import AddCategory from "../pages/Admin/Categories/AddCategory";
import EditCategory from "../pages/Admin/Categories/EditCategory";

// foods
import FoodList from "../pages/Admin/Food/FoodList";
import AddFood from "../pages/Admin/Food/AddFood";
import EditFood from "../pages/Admin/Food/EditFood";
import EmployeesList from "../pages/Admin/EmployeesList";
import FoodReviews from "../pages/Admin/foodreview/FoodReviews";

const AdminRoutes = () => (
  <AdminLayout>
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />

      <Route path="bookings" element={<Booking />} />
      <Route path="reviews" element={<Reviews />} />

      {/* Categories */}
      <Route path="categories" element={<CategoriesList />} />
      <Route path="categories/add" element={<AddCategory />} />
      <Route path="categories/edit/:id" element={<EditCategory />} />

      {/* Foods */}
      <Route path="foods" element={<FoodList />} />
      <Route path="foods/add" element={<AddFood />} />
      <Route path="foods/edit/:id" element={<EditFood />} />

      {/* FILTERED FOOD LIST — FIXED ROUTE */}
      <Route path="foods/category/:categoryId" element={<FoodList />} />

      <Route path="employees" element={<EmployeesList />} />
      <Route path="foods/reviews/:foodId" element={<FoodReviews />} />

    </Routes>
  </AdminLayout>
);

export default AdminRoutes;
