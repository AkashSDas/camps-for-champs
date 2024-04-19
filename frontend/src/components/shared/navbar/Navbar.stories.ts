import { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "./Navbar";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

const meta = {
    title: "Shared/Navbar",
    component: Navbar,
    tags: ["autodocs"],
    args: {},
    argTypes: {},
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tablet: Story = {
    parameters: {
        viewport: {
            viewports: INITIAL_VIEWPORTS,
            defaultViewport: "ipad",
        },
    },
};

export const Mobile: Story = {
    parameters: {
        viewport: {
            viewports: INITIAL_VIEWPORTS,
            defaultViewport: "iphone14pro",
        },
    },
};
