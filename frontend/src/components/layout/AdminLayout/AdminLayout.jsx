import Navbar from "../Navbar/Navbar";
import AdminSidebar from "../../sidebar/AdminSidebar/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <main style={{ marginLeft: 230, padding: "20px", width: "100%" }}>
          {children}
        </main>
      </div>
    </>
  );
}
