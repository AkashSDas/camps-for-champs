import { endpoints, fetchFromAPI } from "@app/lib/api";

export async function updateProfile(data: FormData) {
    type SuccessResponse = {
        payload: Record<string, unknown>;
        message: string;
    };
    type ErrorResponse = { message: string };

    const response = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.profile,
        { method: "PATCH", data },
        true
    );

    if (response.status === 200) {
        return {
            success: true,
            message: response.data?.message,
        };
    }

    return {
        success: false,
        message: response.error?.message ?? "Unknown error",
    };
}
