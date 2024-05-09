import { bodyFont, headingFont } from "@app/pages/_app";
import { FetchedCamp } from "@app/services/camps";
import { Stack, Typography, Divider, Button } from "@mui/material";
import Link from "next/link";
import { ReviewCard } from "./review-card";
import Image from "next/image";

type Props = Pick<
    FetchedCamp,
    "overallRating" | "totalReviews" | "reviews" | "id"
>;

export function CampReviewsList(props: Props) {
    const { overallRating, totalReviews, reviews, id } = props;

    return (
        <Stack gap="24px" px={{ xs: "1rem", md: "4rem" }} mb="48px">
            <Typography
                variant="h2"
                fontFamily={bodyFont.style.fontFamily}
                fontSize="24px"
                fontWeight="bold"
            >
                Reviews
            </Typography>

            <Stack direction="row" gap="1rem">
                <Stack direction="row" gap="0.5rem" alignItems="center">
                    <Image
                        src="/icons/like.png"
                        alt="Overall camp rating percentage"
                        width={20}
                        height={20}
                    />
                    <Typography
                        variant="body1"
                        color="grey.800"
                        fontFamily={headingFont.style.fontFamily}
                    >
                        {overallRating}%
                    </Typography>
                </Stack>

                <Divider orientation="vertical" flexItem />
                <Typography variant="body1" fontWeight="medium">
                    {totalReviews} reviews
                </Typography>
            </Stack>

            <Divider sx={{ borderColor: "grey.100" }} />

            <Stack
                gap="24px"
                divider={<Divider sx={{ borderColor: "grey.100" }} />}
            >
                {reviews.map((review) => {
                    return (
                        <ReviewCard
                            key={review.id.toString()}
                            review={review}
                        />
                    );
                })}
            </Stack>

            <Button
                component={Link}
                href={`/camps/${id}/reviews`}
                variant="outlined"
                sx={{ width: "fit-content" }}
            >
                See all {totalReviews} reviews
            </Button>
        </Stack>
    );
}
