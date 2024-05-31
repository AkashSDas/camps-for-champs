import { headingFont } from "@app/pages/_app";
import { FetchedCamp } from "@app/services/camps";
import { Stack, Typography } from "@mui/material";
import { CampCheckoutForm } from "./CampCheckoutForm";
import { PaymentSection } from "./PaymentSection";
import { useReducer, useState } from "react";

type TabState = "inputs" | "payment";
function tabReducer(state: TabState, action: TabState) {
    switch (action) {
        case "inputs":
            return "inputs";
        case "payment":
            return "payment";
        default:
            return state;
    }
}

type Props = {
    camp: FetchedCamp;
};

export function CampCheckout(props: Props) {
    const { perNightCost } = props.camp;
    const [tab, dispatch] = useReducer(tabReducer, "inputs");
    const [totalCost, setTotalCost] = useState(0);

    return (
        <Stack width="100%" gap="1rem">
            {tab === "inputs" ? (
                <>
                    <Typography sx={{ color: "grey.900" }}>
                        From{" "}
                        <Typography
                            component="span"
                            fontWeight="bold"
                            fontFamily={headingFont.style.fontFamily}
                        >
                            ₹{perNightCost}
                        </Typography>{" "}
                        / night
                    </Typography>

                    <Typography variant="body2">For 4 guests</Typography>
                    <CampCheckoutForm
                        camp={props.camp}
                        updateTotalCost={setTotalCost}
                        changeTab={dispatch}
                    />
                </>
            ) : (
                <PaymentSection amount={totalCost} changeTab={dispatch} />
            )}
        </Stack>
    );
}
