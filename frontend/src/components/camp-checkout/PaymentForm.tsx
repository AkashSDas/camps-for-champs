import { endpoints } from "@app/lib/api";
import {
    confirmCampBooking,
    initializeCampBooking,
} from "@app/services/orders";
import { useCampCheckoutStore } from "@app/store/camp-checkout";
import { ArrowBack } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import {
    useStripe,
    useElements,
    PaymentElement,
} from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { Toast } from "../shared/toast/Toast";

type Props = {
    disabled: boolean;
    amount: number;
    changeTab: (tab: "inputs" | "payment") => void;
    campId: number;
};

export function PaymentForm(props: Props) {
    const stripe = useStripe();
    const elements = useElements();
    const store = useCampCheckoutStore();
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);

    const handleSubmit = useMutation({
        mutationFn: async function (e: FormEvent<HTMLFormElement>) {
            e.preventDefault();
            if (!stripe || !elements) {
                return;
            }

            // initialize booking
            const { success, order } = await initializeCampBooking(
                props.campId,
                {
                    adultGuestsCount: store.adultGuestsCount,
                    childGuestsCount: store.childGuestsCount,
                    petsCount: store.petsCount,
                    checkIn: store.checkInDate!,
                    checkOut: store.checkOutDate!,
                }
            );
            if (!success) {
                setShowErrorSnackbar(true);
            } else {
                // confirm payment
                const { error } = await stripe!.confirmPayment({
                    elements: elements!,
                    confirmParams: {
                        return_url: `${window.location.origin}/orders?bookingSuccess=true&campId=${props.campId}&orderId=${order!.id}`,
                    },
                });

                if (error) {
                    setShowErrorSnackbar(true);
                }
            }
        },
        onError(error, variables, context) {
            console.log({ error });
            setShowErrorSnackbar(true);
        },
    });

    return (
        <Stack component="form" onSubmit={handleSubmit.mutate}>
            <PaymentElement className="payment-element" />

            <Stack direction="row" gap="8px" mt="2rem">
                <Button
                    variant="outlined"
                    sx={{
                        height: "56px",
                        px: "2rem",
                        fontWeight: "500",
                        fontFamily: "inherit",
                    }}
                    disabled={handleSubmit.isPending}
                    onClick={() => props.changeTab("inputs")}
                    startIcon={<ArrowBack />}
                >
                    Back
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    sx={{
                        height: "56px",
                        px: "2rem",
                        fontWeight: "500",
                        fontFamily: "inherit",
                    }}
                    disabled={
                        props.disabled ||
                        !stripe ||
                        !elements ||
                        handleSubmit.isPending
                    }
                    startIcon={
                        <Image
                            src="/figmoji/tent-with-tree.png"
                            alt="Pay for booking"
                            width={20}
                            height={20}
                        />
                    }
                >
                    {handleSubmit.isPending
                        ? "Processing..."
                        : `Pay $${props.amount}`}
                </Button>
            </Stack>

            <Toast
                open={showSuccessSnackbar}
                onClose={() => setShowSuccessSnackbar(false)}
                severity="success"
                message="Successfully booked camp"
            />

            <Toast
                open={showErrorSnackbar}
                onClose={() => setShowErrorSnackbar(false)}
                severity="error"
                message="Failed to book camp"
            />
        </Stack>
    );
}
