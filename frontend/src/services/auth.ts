import { endpoints, fetchFromAPI } from "@app/lib/api";
import { transformUser, type UserFromApiResponse } from "@app/utils/user";

export async function refreshToken() {
    type SuccessResponse = { user: UserFromApiResponse; access: string };
    type ErrorResponse = { detail: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.refreshToken,
        { method: "POST" }
    );
    const { data, status } = res;

    if (status === 200 && data != null && "user" in data) {
        return {
            success: true,
            message: "Successfully refreshed access token",
            user: transformUser(data.user),
            accessToken: data.access,
        };
    } else if (status == 401 && data != null && "detail" in data) {
        return { success: false, message: data.detail };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}
