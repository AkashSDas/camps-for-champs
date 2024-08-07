import { usePaymentIntent } from "@app/hooks/payments";
import { Stack } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useEffect, useMemo } from "react";
import { Loader } from "../shared/loader/Loader";
import { useCampCheckoutStore } from "@app/store/camp-checkout";
import { PaymentForm } from "./PaymentForm";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Props = {
    campId: number;
    amount: number;
    changeTab: (tab: "inputs" | "payment") => void;
};

export function PaymentSection(props: Props): React.JSX.Element {
    const { amount } = props;
    const { createIntent, paymentIntent } = usePaymentIntent();
    const options: StripeElementsOptions = useMemo(
        function () {
            if (paymentIntent == null || paymentIntent.client_secret == null) {
                return {};
            }
            return { clientSecret: paymentIntent.client_secret };
        },
        [paymentIntent]
    );
    const inputs = useCampCheckoutStore((state) => ({
        checkInDate: state.checkInDate,
        checkOutDate: state.checkOutDate,
        adultGuestsCount: state.adultGuestsCount,
        childGuestsCount: state.childGuestsCount,
        petsCount: state.petsCount,
    }));

    useEffect(
        function () {
            createIntent.mutateAsync(amount);
        },
        [amount]
    );

    return (
        <Stack gap="8px">
            {paymentIntent != null ? (
                <Elements stripe={stripePromise} options={options}>
                    <PaymentForm
                        campId={props.campId}
                        changeTab={props.changeTab}
                        paymentIntent={paymentIntent}
                        disabled={
                            props.amount === 0 ||
                            !inputs.checkInDate ||
                            !inputs.checkOutDate ||
                            inputs.adultGuestsCount === 0
                        }
                        amount={props.amount}
                    />
                </Elements>
            ) : (
                <Loader />
            )}
        </Stack>
    );
}
