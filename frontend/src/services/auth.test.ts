import { refreshToken } from "./auth";
import * as apiModule from "../lib/api";

jest.mock("../lib/api", () => ({
    // replace with the actual module path
    fetchFromAPI: jest.fn(),
    endpoints: {
        refreshToken: "/mocked-refresh-token-endpoint",
    },
}));

describe("refreshToken", () => {
    it("should return success response when status is 200 and data contains access token", async () => {
        // Mock the fetchFromAPI function
        (apiModule.fetchFromAPI as jest.Mock).mockResolvedValue({
            status: 200,
            data: { access: "new-access-token" },
        });

        const result = await refreshToken();

        expect(result).toEqual({
            success: true,
            message: "Successfully refreshed access token",
            accessToken: "new-access-token",
        });
    });

    it("should return error response when status is 401 and data contains detail", async () => {
        // Mock the fetchFromAPI function
        (apiModule.fetchFromAPI as jest.Mock).mockResolvedValue({
            status: 401,
            data: { detail: "Unauthorized" },
        });

        const result = await refreshToken();

        expect(result).toEqual({
            success: false,
            message: "Unauthorized",
        });
    });

    it("should return error response when status is not 200 or 401", async () => {
        // Mock the fetchFromAPI function
        (apiModule.fetchFromAPI as jest.Mock).mockResolvedValue({
            status: 500,
            error: { message: "Internal Server Error" },
        });

        const result = await refreshToken();

        expect(result).toEqual({
            success: false,
            message: "Internal Server Error",
        });
    });

    it("should return error response when data is null", async () => {
        // Mock the fetchFromAPI function
        (apiModule.fetchFromAPI as jest.Mock).mockResolvedValue({
            status: 200,
            data: null,
        });

        const result = await refreshToken();

        expect(result).toEqual({
            success: false,
            message: "Unknown error",
        });
    });
});
