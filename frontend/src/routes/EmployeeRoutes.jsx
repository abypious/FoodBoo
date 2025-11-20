import { Routes, Route } from "react-router-dom";
import EmployeeLayout from "../components/layout/EmployeeLayout/EmployeeLayout";

import FoodCategories from "../pages/Employee/category/FoodCategories";
import FoodList from "../pages/Employee/food/FoodList";
import FoodDetails from "../pages/Employee/FoodDetails";
import BookingSuccess from "../pages/Employee/BookingSuccess";

import MyBookings from "../pages/Employee/MyBookings";
import MyReviews from "../pages/Employee/MyReviews";

export default function EmployeeRoutes() {
  return (
    <EmployeeLayout>
      <Routes>
        <Route path="categories" element={<FoodCategories />} />
        <Route path="categories/:categoryId" element={<FoodList />} />
        <Route path="food/:foodId" element={<FoodDetails />} />
        <Route path="booking-success" element={<BookingSuccess />} />

        <Route path="bookings" element={<MyBookings />} />
        <Route path="reviews" element={<MyReviews />} />

        <Route path="*" element={<FoodCategories />} />
      </Routes>
    </EmployeeLayout>
  );
}
