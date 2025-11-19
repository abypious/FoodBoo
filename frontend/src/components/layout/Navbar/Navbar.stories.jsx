import Navbar from "./Navbar";
import { MemoryRouter } from "react-router-dom";
import useAuthStore from "../../../store/authStore";

export default {
  title: "Layout/Navbar",
  component: Navbar,
  decorators: [
    (Story) => {
      useAuthStore.setState({
        user: {
          name: "Bob Smith",
          avatarUrl: "/default-avatar.png",
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

export const Default = {};
