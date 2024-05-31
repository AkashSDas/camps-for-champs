import { endpoints, fetchFromAPI } from "@app/lib/api";
import { PaymentIntent } from "@stripe/stripe-js";

// ========================================
// Services
// ========================================

export async function createPaymentIntent(amount: number) {
    type SuccessResponse = { payment_intent: PaymentIntent };
    type ErrorResponse = { detail: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.createPaymentIntent,
        { method: "POST", data: { amount } },
        true
    );
    const { data, status } = res;

    if (status === 201 && data != null && "payment_intent" in data) {
        return {
            success: true,
            paymentIntent: data.payment_intent,
        };
    } else if (status == 400 && data != null && "detail" in data) {
        return { success: false, message: data.detail };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}
