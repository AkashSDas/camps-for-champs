import { headingFont } from "@app/pages/_app";
import { FetchedCamp } from "@app/services/camps";
import { Stack, Typography } from "@mui/material";
import { CampBookingCardForm } from "./CampBookingCardForm";

type Props = Pick<FetchedCamp, "perNightCost" | "id"> & {
    fullscreen?: boolean;
};

export function CampBookingCard(props: Props) {
    const { perNightCost, fullscreen } = props;

    return (
        <Stack
            width={fullscreen ? "100%" : { xs: "360px", lg: "460px" }}
            maxWidth={fullscreen ? "100%" : "460px"}
            bgcolor="white"
            boxShadow="0px 4px 8px rgba(142, 152, 168, 0.25)"
            borderRadius="16px"
            p={{ xs: "1.5rem", lg: "2rem" }}
            gap="1rem"
        >
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

            <CampBookingCardForm perNightCost={perNightCost} id={props.id} />
        </Stack>
    );
}
