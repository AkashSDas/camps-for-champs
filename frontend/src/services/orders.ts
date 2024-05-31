import { z } from "zod";
import { SearchCampsSuccessCampSchema } from "./camps";
import { endpoints, fetchFromAPI } from "@app/lib/api";
import { ReviewSchema } from "./reviews";

// ========================================
// Schema
// ========================================

const CampOccupancySchema = z
    .object({
        id: z.number(),
        check_in: z.string(),
        check_out: z.string(),
        adult_guests_count: z.number(),
        child_guests_count: z.number(),
        pets_count: z.number(),
    })
    .transform((data) => ({
        id: data.id,
        checkIn: data.check_in,
        checkOut: data.check_out,
        adultGuestsCount: data.adult_guests_count,
        childGuestsCount: data.child_guests_count,
        petsCount: data.pets_count,
    }));

const PaymentStatusSchema = z.union([
    z.literal("Initialized"),
    z.literal("Failed"),
    z.literal("Completed"),
]);

const BookingStatusSchema = z.union([
    z.literal("Pending"),
    z.literal("Fullfilled"),
]);

const OrderSchema = z
    .object({
        id: z.number(),
        camp: SearchCampsSuccessCampSchema,
        camp_occupancy: CampOccupancySchema,
        user: z.number(),
        created_at: z.string(),
        amount: z.string(),
        payment_status: PaymentStatusSchema,
        booking_status: BookingStatusSchema,
        review: ReviewSchema.optional().nullable(),
    })
    .transform((data) => ({
        id: data.id,
        camp: data.camp,
        campOccupancy: data.camp_occupancy,
        user: data.user,
        createdAt: data.created_at,
        amount: Number(data.amount),
        paymentStatus: data.payment_status,
        bookingStatus: data.booking_status,
        review: data.review ?? null,
    }));

const GetOrdersSchema = z.object({
    orders: z.array(OrderSchema),
});

export type Order = z.infer<typeof OrderSchema>;

// ========================================
// Services
// ========================================

type BookCampPayload = {
    adultGuestsCount: number;
    childGuestsCount: number;
    petsCount: number;
    checkIn: Date;
    checkOut: Date;
};

function formatToDate(date: Date) {
    let format = date.toLocaleDateString().split("T")[0];
    return `${format.split("/")[2]}-${format.split("/")[1]}-${format.split("/")[0]}`;
}

export async function initializeCampBooking(
    campId: number,
    payload: BookCampPayload
) {
    type SuccessResponse = {
        message: string;
        order: z.infer<typeof OrderSchema>;
    };
    type ErrorResponse = { detail: string } | { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.initializeCampBooking(campId),
        {
            method: "POST",
            data: {
                adult_guests_count: payload.adultGuestsCount ?? 0,
                child_guests_count: payload.childGuestsCount ?? 0,
                pets_count: payload.petsCount ?? 0,
                check_in: formatToDate(payload.checkIn),
                check_out: formatToDate(payload.checkOut),
            },
        },
        true
    );
    const { data, status } = res;

    if (status === 201 && data != null && "order" in data) {
        // const parsedData = OrderSchema.parse(data.order);
        return {
            success: true,
            order: data.order as z.infer<typeof OrderSchema>,
        };
    } else if (
        status == 400 &&
        data != null &&
        ("detail" in data || "message" in data)
    ) {
        // @ts-ignore
        return { success: false, message: data?.detail ?? data?.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function confirmCampBooking(campId: number, orderId: number) {
    type SuccessResponse = {
        message: string;
        order: z.infer<typeof OrderSchema>;
    };
    type ErrorResponse = { detail: string } | { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.confirmCampBooking(campId, orderId),
        { method: "PUT" },
        true
    );
    const { data, status } = res;

    if (status === 200 && data != null && "order" in data) {
        const parsedData = OrderSchema.parse(data);
        return { success: true, order: parsedData };
    } else if (
        status == 400 &&
        data != null &&
        ("detail" in data || "message" in data)
    ) {
        // @ts-ignore
        return { success: false, message: data?.detail ?? data?.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function getOrders() {
    type SuccessResponse = {
        message: string;
        orders: z.infer<typeof GetOrdersSchema>["orders"];
    };
    type ErrorResponse = { detail: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getOrders,
        { method: "GET" },
        true
    );
    const { data, status } = res;

    console.log({ mm: data });
    if (status === 200 && data != null && "orders" in data) {
        const parsedData = GetOrdersSchema.parse(data);
        return { success: true, orders: parsedData.orders };
    } else if (status == 400 && data != null && "detail" in data) {
        return { success: false, message: data?.detail };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}
