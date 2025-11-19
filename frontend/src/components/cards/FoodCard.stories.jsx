import FoodCard from "./FoodCard";

export default {
  title: "Cards/FoodCard",
  component: FoodCard,
};

export const Default = {
  args: {
    food: {
      id: 1,
      name: "Chicken Biryani",
      shortDescription: "Aromatic biryani with spices",
      imageUrl: "/placeholder-food.png",
    },
  },
  render: (args) => (
    <div style={{ width: "240px" }}>
      <FoodCard {...args} onClick={() => {}} />
    </div>
  ),
};
