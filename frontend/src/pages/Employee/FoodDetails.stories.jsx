  import FoodDetails from "./food/FoodDetails";
  import { MemoryRouter } from "react-router-dom";
  import useFoodStore from "../../store/foodStore";

  export default {
    title: "Pages/Employee/FoodDetails",
    component: FoodDetails,
    decorators: [
      (Story) => {
        useFoodStore.setState({
          food: {
            id: 1,
            name: "Chicken Curry",
            description: "Rich gravy, Kerala style",
            imageUrl: "/placeholder-food.png",
          },
          loading: false,
        });
        return (
          <MemoryRouter initialEntries={["/employee/food/1"]}>
            <Story />
          </MemoryRouter>
        );
      },
    ],
  };

  export const Default = {};
