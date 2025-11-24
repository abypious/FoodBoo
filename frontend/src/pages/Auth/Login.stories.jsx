import Login from "./Login";
import { MemoryRouter } from "react-router-dom";
import useAuthStore from "../../store/authStore";

function mockAuth() {
  useAuthStore.setState({
    user: null,
    token: null,
    loading: false,
    error: null,
    login: async () => ({
      id: 1,
      name: "Bob Smith",
      email: "bob@fooboo.com",
      role: "ROLE_EMPLOYEE",
    }),
  });
}

export default {
  title: "Pages/Login",
  component: Login,
  decorators: [
    (Story) => {
      mockAuth();
      return (
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      );
    },
  ],
};
  
export const Default = {};
