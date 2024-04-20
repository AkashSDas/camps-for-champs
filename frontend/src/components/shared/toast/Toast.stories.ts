import { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./Toast";

const meta = {
    title: "Shared/Toast",
    component: Toast,
    tags: ["autodocs"],
    args: {
        open: true,
        onClose: () => console.log("onClose"),
        severity: "success",
        message: "Logged in successfully",
    },
    argTypes: {},
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Success: Story = {
    args: {
        severity: "success",
    },
};

export const Error: Story = {
    args: {
        severity: "error",
    },
};
