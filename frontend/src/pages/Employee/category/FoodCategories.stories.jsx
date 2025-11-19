import FoodCategories from "./FoodCategories";
import { MemoryRouter } from "react-router-dom";
import useFoodCategoryStore from "../../../store/foodCategoryStore";

export default {
  title: "Pages/Employee/FoodCategories",
  component: FoodCategories,
  decorators: [
    (Story) => {
      useFoodCategoryStore.setState({
        categories: [
          { id: 1, name: "Sea Grill Miami", imageUrl: "https://picsum.photos/300?1" },
          { id: 2, name: "Villagio Bar", imageUrl: "https://picsum.photos/300?2" },
          { id: 3, name: "Carpaccio Dream", imageUrl: "https://picsum.photos/300?3" },
        ],
        loading: false,
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
