import { fetchFromAPI, endpoints } from "@app/lib/api";

export async function markReviewHelpful(campId: number, reviewId: number) {
    type SuccessResponse = { message: string };
    type ErrorResponse = { detail: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.markReviewHelpful(campId, reviewId),
        { method: "PATCH" },
        true
    );
    const { data, status } = res;

    if (status === 200 && data != null && "message" in data) {
        return { success: true, message: data.message };
    } else if (status == 400 && data != null && "detail" in data) {
        return { success: false, message: data.detail };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}
