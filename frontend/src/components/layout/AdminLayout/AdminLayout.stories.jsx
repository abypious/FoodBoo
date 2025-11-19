import AdminLayout from "./AdminLayout";
import { MemoryRouter } from "react-router-dom";
import useAuthStore from "../../../store/authStore";

export default {
  title: "Layout/AdminLayout",
  component: AdminLayout,
  decorators: [
    (Story) => {
      useAuthStore.setState({
        user: {
          id: 1,
          name: "Admin User",
          email: "admin@fooboo.com",
          role: "ROLE_ADMIN",
        },
        token: "dummy",
      });

      return (
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      );
    },
  ],
};

export const Example = {
  render: () => (
    <AdminLayout>
      <div style={{ padding: 20 }}>Admin Dashboard Preview</div>
    </AdminLayout>
  ),
};
