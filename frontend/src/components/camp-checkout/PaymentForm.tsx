import { ArrowBack } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import {
    useStripe,
    useElements,
    PaymentElement,
} from "@stripe/react-stripe-js";
import Image from "next/image";

type Props = {
    disabled: boolean;
    amount: number;
    changeTab: (tab: "inputs" | "payment") => void;
};

export function PaymentForm(props: Props) {
    const stripe = useStripe();
    const elements = useElements();

    return (
        <>
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
            </Stack>
        </>
    );
}
