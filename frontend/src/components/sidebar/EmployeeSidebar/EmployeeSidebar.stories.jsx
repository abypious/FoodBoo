import EmployeeSidebar from "./EmployeeSidebar";
import { MemoryRouter } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import * as API from "../../../api/axiosConfig";

API.default.get = (url) => {
  if (url.startsWith("/employees/")) {
    return Promise.resolve({
      data: { totalPoints: 150 }
    });
  }

  if (url.startsWith("/bookings/employee/")) {
    return Promise.resolve({
      data: [
        {
          id: 1,
          date: "2025-01-01",
          food: {
            name: "Villagio Restaurant & Bar",
            imageUrl:
              "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
          }
        },
        {
          id: 2,
          date: "2025-01-02",
          food: {
            name: "Crab Delight",
            imageUrl:
              "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg",
          }
        }
      ]
    });
  }

  return Promise.resolve({ data: {} });
};


function setupAuthMock() {
  useAuthStore.setState({
    user: {
      id: 1,
      name: "Bob Smith",
      email: "bob@fooboo.com",
      role: "ROLE_EMPLOYEE",
    },
    token: "storybook-token",
    loading: false,
  });
}

export default {
  title: "Sidebar/EmployeeSidebar",
  component: EmployeeSidebar,
  decorators: [
    (Story) => {
      setupAuthMock();
      return (
        <MemoryRouter>
          <div style={{ height: "100vh", background: "#f7f7f7" }}>
            <Story />
          </div>
        </MemoryRouter>
      );
    },
  ],
};

export const Default = {};
