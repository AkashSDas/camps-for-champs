import { createPaymentIntent } from "@app/services/payments";
import { PaymentIntent } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Create payment i.e. client secrent which will be used for
 * displaying payment form
 */
export function usePaymentIntent() {
    const createIntent = useMutation({
        async mutationFn(amount: number) {
            return createPaymentIntent(amount);
        },
    });

    return { paymentIntent: createIntent.data?.paymentIntent, createIntent };
}
