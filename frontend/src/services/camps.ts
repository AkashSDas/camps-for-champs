import { type SearchCampsQueryValues } from "@app/hooks/camp-search";
import { endpoints, fetchFromAPI } from "@app/lib/api";
import { Optional } from "@tanstack/react-query";
import { z } from "zod";

// ========================================
// Schema
// ========================================

const SearchCampsSuccessCampTagSchema = z.object({
    id: z.number(),
    label: z.string(),
});

const SearchCampsSuccessCampFeatureSchema = z
    .object({
        id: z.number(),
        camp: z.object({
            id: z.number(),
            name: z.string(),
        }),
        feature: z.object({
            id: z.number(),
            feature_type: z.union([
                z.literal("amenity"),
                z.literal("surrounding"),
                z.literal("activity"),
                z.literal("highlight"),
            ]),
            label: z.string(),
            description: z.string(),
        }),
        is_available: z.boolean(),
    })
    .transform((data) => ({
        id: data.id,
        camp: data.camp,
        feature: {
            id: data.feature.id,
            label: data.feature.label,
            description: data.feature.description,
            featureType: data.feature.feature_type,
        },
        isAvailable: data.is_available,
    }));

const SearchCampsSuccessCampImageSchema = z
    .object({
        id: z.number(),
        camp: z.number(),
        image: z.string(),
        alt_text: z.string().nullable(),
        created_at: z.string(),
    })
    .transform((data) => ({
        id: data.id,
        camp: data.camp,
        image: data.image,
        altText: data.alt_text,
        createdAt: data.created_at,
    }));

const SearchCampsSuccessCampReviewSchema = z
    .object({
        id: z.number(),
        author: z.object({
            id: z.number(),
            fullname: z.string(),
        }),
        camp: z.number(),
        rating: z.number(),
        created_at: z.string(),
        comment: z.string().nullable(),
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

const SearchCampsSuccessCampSchema = z
    .object({
        id: z.number(),
        name: z.string(),
        about: z.string(),
        check_in_at: z.string(),
        check_out_at: z.string(),
        occupancy_count: z.number(),
        per_night_cost: z.string(),
        is_active: z.boolean(),
        tags: z.array(SearchCampsSuccessCampTagSchema),
        features: z.array(SearchCampsSuccessCampFeatureSchema),
        images: z.array(SearchCampsSuccessCampImageSchema),
        reviews: z.array(SearchCampsSuccessCampReviewSchema),
        average_rating: z.number(),
        created_at: z.string(),
        updated_at: z.string(),
        created_by: z.number(),
    })
    .transform((data) => ({
        id: data.id,
        name: data.name,
        about: data.about,
        checkInAt: data.check_in_at,
        checkOutAt: data.check_out_at,
        occupancyCount: data.occupancy_count,
        perNightCost: data.per_night_cost,
        isActive: data.is_active,
        tags: data.tags,
        features: data.features,
        images: data.images,
        reviews: data.reviews,
        averageRating: data.average_rating,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        createdBy: data.created_by,
    }));

const SearchCampsSuccessSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.object({
        camps: z.array(SearchCampsSuccessCampSchema),
    }),
});

// ========================================
// Services
// ========================================

export async function searchCamps(
    query: Partial<SearchCampsQueryValues>,
    limit: number,
    page: number
) {
    type SuccessResponse = z.infer<typeof SearchCampsSuccessSchema>;
    type ErrorResponse = { detail: string };

    const queryData = Object.fromEntries(
        Object.entries({
            adult_guests_count: query.adultGuestsCount,
            child_guests_count: query.childGuestsCount,
            pets_count: query.petsCount,
            location: query.location,
            check_in_date: query.checkInDate,
            check_out_date: query.checkOutDate,
        }).filter(([_, value]) => value !== undefined)
    );

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.searchCamps,
        {
            method: "GET",
            data: queryData,
            params: { limit: limit, page: page },
        }
    );
    const { data, status } = res;

    if (status === 200 && data != null && "results" in data) {
        const parsedData = SearchCampsSuccessSchema.parse(data);
        return {
            success: true,
            camps: parsedData.results.camps,
            count: parsedData.count,
            next: parsedData.next,
            previous: parsedData.previous,
        };
    } else if (status == 400 && data != null && "detail" in data) {
        return { success: false, message: data.detail };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}
