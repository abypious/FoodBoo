import EmployeeLayout from "./EmployeeLayout";
import { MemoryRouter } from "react-router-dom";
import useAuthStore from "../../../store/authStore";

export default {
  title: "Layout/EmployeeLayout",
  component: EmployeeLayout,
  decorators: [
    (Story) => {
      useAuthStore.setState({
        user: {
          id: 1,
          name: "Employee User",
          email: "aby@fooboo.com",
          role: "ROLE_EMPLOYEE",
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
  render: () => <EmployeeLayout>Content here</EmployeeLayout>,
};
