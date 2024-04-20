import { Meta, StoryObj } from "@storybook/react";
import { Loader } from "./Loader";

const meta = {
    title: "Shared/Loader",
    component: Loader,
    tags: ["autodocs"],
    args: {},
    argTypes: {},
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
    args: {
        variant: "primary",
    },
};

export const Neutral: Story = {
    args: {
        variant: "neutral",
    },
};
