import FoodList from "./FoodList";
import { MemoryRouter } from "react-router-dom";
import useFoodStore from "../../store/foodStore";

export default {
  title: "Pages/Employee/FoodList",
  component: FoodList,
  decorators: [
    (Story) => {
      useFoodStore.setState({
        foods: [
          {
            id: 1,
            name: "Masala Dosa",
            shortDescription: "Crispy and delicious",
            imageUrl: "/placeholder-food.png",
          },
        ],
        loading: false,
      });
      return (
        <MemoryRouter initialEntries={["/employee/categories/1"]}>
          <Story />
        </MemoryRouter>
      );
    },
  ],
};

export const Default = {};
