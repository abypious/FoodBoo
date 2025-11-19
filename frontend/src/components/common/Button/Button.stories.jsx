import Button from "./Button";

export default {
  title: "Common/Button",
  component: Button,
};

export const Primary = {
  args: {
    label: "Primary Button",
    variant: "primary",
  },
};

export const Danger = {
  args: {
    label: "Danger Button",
    variant: "danger",
  },
};

export const Disabled = {
  args: {
    label: "Disabled Button",
    variant: "primary",
    disabled: true,
  },
};
