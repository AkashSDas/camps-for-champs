import { Button } from "@mui/material";
import {
    useStripe,
    useElements,
    PaymentElement,
} from "@stripe/react-stripe-js";
import Image from "next/image";

type Props = {
    disabled: boolean;
    amount: number;
};

export function PaymentForm(props: Props) {
    const stripe = useStripe();
    const elements = useElements();

    return (
        <>
            <PaymentElement className="payment-element" />
            <Button
                type="submit"
                variant="contained"
                disableElevation
                sx={{ height: "56px", mt: "2rem" }}
                disabled={props.disabled || !stripe || !elements}
                startIcon={
                    <Image
                        src="/figmoji/tent-with-tree.png"
                        alt="Pay for booking"
                        width={20}
                        height={20}
                    />
                }
            >
                Pay ₹{props.amount}
            </Button>
        </>
    );
}
