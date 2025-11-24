import Navbar from "../Navbar/Navbar";
import EmployeeSidebar from "../../sidebar/EmployeeSidebar/EmployeeSidebar";
import "./EmployeeLayout.css";

export default function EmployeeLayout({ children }) {
  return (
    <>
      <Navbar />

      <EmployeeSidebar />

      <div className="employee-content">
        {children}
      </div>
    </>
  );
}
