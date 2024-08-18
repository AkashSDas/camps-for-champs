import { Meta, StoryObj } from "@storybook/react";
import ForgotPassword from "@app/pages/forgot-password";
import { userEvent, within, expect } from "@storybook/test";

const meta = {
    title: "Pages/ForgotPassword",
    component: ForgotPassword,
    tags: ["autodocs"],
    args: {},
    argTypes: {},
} satisfies Meta<typeof ForgotPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InvalidEmail: Story = {
    args: {},
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByTestId("forgot-password-email");
        const btn = canvas.getByTestId("forgot-password-button");

        const inputValue = "nongmail.com";
        await userEvent.type(input, inputValue);
        await userEvent.click(btn);

        expect(input).toHaveAttribute("aria-invalid", "true");
    },
};
