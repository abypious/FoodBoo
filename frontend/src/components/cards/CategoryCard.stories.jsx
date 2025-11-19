import CategoryCard from "./CategoryCard";

export default {
  title: "Cards/CategoryCard",
  component: CategoryCard,
};

export const Default = {
  args: {
    item: {
      id: 1,
      name: "Sea Grill North Miami Beach",
      imageUrl: "https://picsum.photos/300/200?random=1",
    },
  },
  render: (args) => (
    <div style={{ width: "240px" }}>
      <CategoryCard {...args} />
    </div>
  ),
};
