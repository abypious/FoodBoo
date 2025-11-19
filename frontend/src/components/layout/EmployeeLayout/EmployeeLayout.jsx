import Navbar from "../Navbar/Navbar";
import EmployeeSidebar from "../../sidebar/EmployeeSidebar/EmployeeSidebar";
import "./EmployeeLayout.css";

export default function EmployeeLayout({ children }) {
  return (
    <>
      <Navbar />

      {/* Sidebar stays fixed */}
      <EmployeeSidebar />

      {/* Main content */}
      <div className="employee-content">
        {children}
      </div>
    </>
  );
}
