import { FetchedCamp } from "@app/services/camps";
import { markReviewHelpful } from "@app/services/reviews";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Toast } from "@app/components/shared/toast/Toast";

type Props = {
    review: FetchedCamp["reviews"][number];
};

export function ReviewCard(props: Props) {
    const { review } = props;
    const { author, comment, rating, createdAt } = review;
    const { query } = useRouter();
    const doesLike = useMemo(
        function () {
            if (rating > 2) return true;
            return false;
        },
        [rating]
    );
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

    const markHelpful = useMutation({
        async mutationFn() {
            try {
                await markReviewHelpful(
                    parseInt(query.campId as string, 10),
                    review.id
                );
                setShowSuccessSnackbar(true);
            } catch (e) {}
        },
    });

    return (
        <Stack gap="8px">
            <Stack direction="row" gap="1rem">
                <Box position="relative">
                    <Image
                        src={
                            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                        alt={author.fullname}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                        width={50}
                        height={50}
                    />

                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        p="4px"
                        bgcolor="primary.900"
                        width="26px"
                        height="26px"
                        position="absolute"
                        bottom="-2px"
                        right="-2px"
                        borderRadius="50%"
                    >
                        <Image
                            src={
                                doesLike
                                    ? "/icons/like-light.png"
                                    : "/icons/dislike-light.png"
                            }
                            alt={doesLike ? "Like" : "Dislike"}
                            width={16}
                            height={16}
                        />
                    </Stack>
                </Box>

                <Stack gap="4px">
                    <Typography fontWeight="medium" color="grey.800">
                        {author.fullname}
                    </Typography>
                    <Typography fontSize="14px">
                        {formatReviewDate(createdAt)}
                    </Typography>
                </Stack>
            </Stack>

            <Typography color="grey.800">{comment}</Typography>

            <Button
                onClick={() => markHelpful.mutateAsync()}
                disabled={markHelpful.isPending}
                variant="text"
                sx={{
                    width: "fit-content",
                    height: "fit-content",
                    p: 0,
                    color: "grey.600",
                    textDecoration: "underline",
                    bgcolor: "transparent",
                    "&:hover": {
                        color: "grey.700",
                        bgcolor: "transparent",
                        textDecoration: "underline",
                    },
                    "&:active": {
                        color: "grey.900",
                        bgcolor: "transparent",
                        textDecoration: "underline",
                    },
                }}
                disableElevation
                disableRipple
                startIcon={
                    <Image
                        src="/icons/like.png"
                        alt="Like review"
                        width={20}
                        height={20}
                    />
                }
            >
                {markHelpful.isPending
                    ? "Loading..."
                    : showSuccessSnackbar
                      ? "Thanks for letting us know"
                      : "Helpful"}
            </Button>

            <Toast
                open={showSuccessSnackbar}
                onClose={() => setShowSuccessSnackbar(false)}
                severity="success"
                message="Review marked as helpful"
            />
        </Stack>
    );
}

/**
 * input format is `2024-05-07T17:58:15.880554Z`
 * output format is September 17, 2023
 */
function formatReviewDate(date: string) {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
