import { render, screen } from "@testing-library/react";
import { Loader } from "./Loader";

describe("Loader", () => {
    test("renders the loader component", () => {
        render(<Loader />);
        const loaderElement = screen.getByTestId("loader");
        expect(loaderElement).toBeInTheDocument();
    });

    test("renders the loader with primary variant", () => {
        render(<Loader variant="primary" />);
        const loaderElement = screen.getByTestId("loader");
        expect(loaderElement).toHaveStyle({ backgroundColor: "primary.700" });
    });

    test("renders the loader with neutral variant", () => {
        render(<Loader variant="neutral" />);
        const loaderElement = screen.getByTestId("loader");
        expect(loaderElement).toHaveStyle({ backgroundColor: "grey.500" });
    });
});
