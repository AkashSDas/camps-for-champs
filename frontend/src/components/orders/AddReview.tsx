import { bodyFont, headingFont } from "@app/pages/_app";
import { Order } from "@app/services/orders";
import {
    Typography,
    Stack,
    Button,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ReviewsRoundedIcon from "@mui/icons-material/ReviewsRounded";
import { ReviewModal } from "./ReviewModal";
import { useState } from "react";

type Props = {
    review: Order["review"];
    campId: number;
};

export function AddReview({ review, campId }: Props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [isOpen, setIsOpen] = useState(false);

    if (review == null) {
        return (
            <>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ReviewsRoundedIcon />}
                    onClick={() => setIsOpen(true)}
                    sx={{
                        mt: "12px",
                        fontFamily: bodyFont.style.fontFamily,
                        width: "fit-content",
                    }}
                >
                    Add Review
                </Button>
                <ReviewModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    fullScreen={fullScreen}
                    campId={campId}
                />
            </>
        );
    }

    return (
        <Typography>
            <Stack gap="8px" direction="row">
                {Array.from({ length: review.rating }).map((_, index) => (
                    <StarRoundedIcon key={index} />
                ))}
            </Stack>

            <Typography
                fontFamily={headingFont.style.fontFamily}
                fontSize="24px"
            >
                {`"`}S
            </Typography>

            <Typography>{review.comment ?? "I liked it."}</Typography>

            <Typography
                fontFamily={headingFont.style.fontFamily}
                fontSize="24px"
            >{`"`}</Typography>
        </Typography>
    );
}
