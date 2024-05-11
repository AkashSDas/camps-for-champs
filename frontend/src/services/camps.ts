import { type SearchCampsQueryValues } from "@app/hooks/camp-search";
import { endpoints, fetchFromAPI } from "@app/lib/api";
import { z } from "zod";

// ========================================
// Schema
// ========================================

const SearchCampsSuccessCampTagSchema = z.object({
    id: z.number(),
    label: z.string(),
});

const FeatureTypeSchema = z.union([
    z.literal("amenity"),
    z.literal("surrounding"),
    z.literal("activity"),
    z.literal("highlight"),
]);

const SearchCampsSuccessCampFeatureSchema = z
    .object({
        id: z.number(),
        camp: z.object({
            id: z.number(),
            name: z.string(),
        }),
        feature: z.object({
            id: z.number(),
            feature_type: FeatureTypeSchema,
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
        total_images: z.number(),
        created_at: z.string(),
    })
    .transform((data) => ({
        id: data.id,
        camp: data.camp,
        image: data.image,
        altText: data.alt_text,
        totalImages: data.total_images,
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
        address: z.string(),
        latitude: z.string(),
        longitude: z.string(),
        average_rating: z.number(),
        total_reviews: z.number(),
        overall_rating: z.number(),
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
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        averageRating: data.average_rating,
        totalReviews: data.total_reviews,
        overallRating: data.overall_rating,
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

const GetCampsSuccessSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(SearchCampsSuccessCampSchema),
});

const CampImagesApiResponseSchema = z
    .object({
        images: z.array(
            z.object({
                id: z.number(),
                camp: z.number(),
                image: z.string(),
                alt_text: z.string().nullable(),
                created_at: z.string(),
            })
        ),
        camp: z.object({
            id: z.number(),
            name: z.string(),
        }),
    })
    .transform((data) => ({
        images: data.images.map((image) => ({
            id: image.id,
            camp: image.camp,
            image: image.image,
            altText: image.alt_text,
            createdAt: image.created_at,
        })),
        camp: {
            id: data.camp.id,
            name: data.camp.name,
        },
    }));

export type FetchedCamp = z.infer<typeof SearchCampsSuccessCampSchema>;

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

export async function getCamp(campId: number) {
    type SuccessResponse = z.infer<typeof SearchCampsSuccessCampSchema>;
    type ErrorResponse = { detail: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getCamp(campId),
        { method: "GET" }
    );
    const { data, status } = res;

    if (status === 200 && data != null && "id" in data) {
        const parsedData = SearchCampsSuccessCampSchema.parse(data);
        return {
            success: true,
            camp: parsedData,
        };
    } else if (status == 400 && data != null && "detail" in data) {
        return { success: false, message: data.detail };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function getCampImages(campId: number) {
    type SuccessResponse = z.infer<typeof CampImagesApiResponseSchema>;
    type ErrorResponse = { detail: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getCampImages(campId),
        { method: "GET" }
    );
    const { data, status } = res;

    if (status === 200 && data != null && "images" in data) {
        const parsedData = CampImagesApiResponseSchema.parse(data);
        return {
            success: true,
            images: parsedData.images,
            camp: parsedData.camp,
        };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

/**
 * Its only used for ISR in the camp images page
 */
export async function getAllCamps() {
    type SuccessResponse = z.infer<typeof GetCampsSuccessSchema>;
    type ErrorResponse = { detail: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getAllCamps,
        { method: "GET", params: { limit: 2 } }
    );
    const { data, status } = res;

    if (status === 200 && data != null && "results" in data) {
        const parsedData = GetCampsSuccessSchema.parse(data);
        return {
            success: true,
            camps: parsedData.results,
        };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}
