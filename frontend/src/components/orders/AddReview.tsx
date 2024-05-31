import { bodyFont, headingFont } from "@app/pages/_app";
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
import { z } from "zod";
import { ReviewSchema } from "@app/services/reviews";

type Props = {
    review: z.infer<typeof ReviewSchema> | undefined;
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
            <Stack component="span" gap="8px" direction="row">
                {Array.from({ length: review.rating }).map((_, index) => (
                    <StarRoundedIcon key={index} fontSize="large" />
                ))}
            </Stack>

            <Typography
                fontFamily={headingFont.style.fontFamily}
                fontSize="16px"
                component="span"
            >
                {`"`}
            </Typography>

            <Typography component="span">
                {review.comment ?? "I liked it."}
            </Typography>

            <Typography
                component="span"
                fontFamily={headingFont.style.fontFamily}
                fontSize="16px"
            >{`"`}</Typography>
        </Typography>
    );
}
