import { headingFont } from "@app/pages/_app";
import { FetchedCamp } from "@app/services/camps";
import { Stack, Typography } from "@mui/material";
import { CampCheckoutForm } from "./CampCheckoutForm";

type Props = {
    camp: FetchedCamp;
};

export function CampCheckout(props: Props) {
    const { perNightCost } = props.camp;

    return (
        <Stack width="100%" gap="1rem">
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
            <CampCheckoutForm camp={props.camp} />
        </Stack>
    );
}
