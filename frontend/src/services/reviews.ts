import { fetchFromAPI, endpoints } from "@app/lib/api";
import { z } from "zod";

// ========================================
// Schema
// ========================================

const ReviewSchema = z
    .object({
        id: z.number(),
        author: z.object({
            id: z.number(),
            fullname: z.string(),
        }),
        camp: z.number(),
        rating: z.number(),
        created_at: z.string(),
        comment: z.string(),
        helpful_count: z.number(),
    })
    .transform((data) => ({
        id: data.id,
        author: data.author,
        camp: data.camp,
        rating: data.rating,
        createdAt: data.created_at,
        comment: data.comment,
        helpfulCount: data.helpful_count,
    }));

const ReviewResponseSchema = z
    .object({
        count: z.number(),
        next: z.string().nullable(),
        previous: z.string().nullable(),
        results: z.object({
            reviews: z.array(ReviewSchema),
            overall_rating: z.number(),
            total_reviews: z.number(),
        }),
    })
    .transform((data) => ({
        count: data.count,
        next: data.next,
        previous: data.previous,
        reviews: data.results.reviews,
        overallRating: data.results.overall_rating,
        totalReviews: data.results.total_reviews,
    }));

export type CampReview = z.infer<
    typeof ReviewResponseSchema
>["reviews"][number];

// ========================================
// Services
// ========================================

export const REVIEWS_LIMIT = 5;

export async function getCampReviews(
    campId: number,
    searchText: string,
    page: number = 1
) {
    type SuccessResponse = z.infer<typeof ReviewResponseSchema>;
    type ErrorResponse = { detail: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getCampReviews(campId, searchText),
        { params: { page, limit: REVIEWS_LIMIT } }
    );
    const { data, status } = res;

    if (status === 200 && ReviewResponseSchema.safeParse(data).success) {
        const response = ReviewResponseSchema.parse(data);
        return {
            success: true,
            reviews: response.reviews,
            overallRating: response.overallRating,
            totalReviews: response.totalReviews,
            next: response.next,
            previous: response.previous,
        };
    }

    return { success: false };
}

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
