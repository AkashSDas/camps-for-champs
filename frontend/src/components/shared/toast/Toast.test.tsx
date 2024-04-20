import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { Toast } from "./Toast";

jest.useFakeTimers();

describe("Toast", () => {
    test("renders toast message correctly", () => {
        const message = "This is a toast message";
        const onClose = jest.fn();

        render(
            <Toast
                open={true}
                onClose={onClose}
                severity="success"
                message={message}
            />
        );

        const toastMessage = screen.getByText(message);
        expect(toastMessage).toBeInTheDocument();
    });

    test("calls onClose function after autoHideDuration", async () => {
        const onCloseMock = jest.fn();
        const message = "This is a test message";
        const severity = "success";

        render(
            <Toast
                open={true}
                onClose={onCloseMock}
                severity={severity}
                message={message}
            />
        );

        act(() => {
            jest.advanceTimersByTime(7000);
        });

        await waitFor(() => {
            expect(onCloseMock).toHaveBeenCalled();
        });
    });
});
