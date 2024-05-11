import { ReviewCard } from "@app/components/reviews/review-card";
import { Navbar } from "@app/components/shared/navbar/Navbar";
import { bodyFont, headingFont } from "@app/pages/_app";
import { REVIEWS_LIMIT, getCampReviews } from "@app/services/reviews";
import { Box, Divider, Pagination, Stack, Typography } from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    type InferGetServerSidePropsType,
    type GetServerSideProps,
} from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export const config = {
    runtime: "nodejs", // or "edge"
};

export const getServerSideProps = async function (context) {
    const { res } = context;
    res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate"); // 1 second

    const { campId } = context.query;
    const { page } = context.params ?? {};

    if (typeof campId !== "string" || isNaN(parseInt(campId, 10))) {
        return { notFound: true };
    }

    const result = await getCampReviews(
        parseInt(campId, 10),
        "",
        page === undefined ? 1 : parseInt(page as string, 10)
    );
    if (!result.success) {
        return { notFound: true };
    }

    return {
        props: {
            reviews: result.reviews!,
            overallRating: result.overallRating!,
            totalReviews: result.totalReviews!,
            nextPage: result.next,
            previousPage: result.previous,
        },
    };
} satisfies GetServerSideProps;

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function CampReviews(props: Props) {
    const { reviews, overallRating, totalReviews, nextPage, previousPage } =
        props;
    const [page, setPage] = useState<number>(1);
    const router = useRouter();

    const { data } = useQuery<Awaited<ReturnType<typeof getCampReviews>>>({
        queryKey: ["campReviews", page],
        async queryFn() {
            return getCampReviews(
                parseInt(router.query.campId as string, 10),
                "",
                page
            );
        },
        initialData: {
            success: true,
            next: nextPage,
            previous: previousPage,
            reviews,
            overallRating,
            totalReviews,
        } as any,
        placeholderData: keepPreviousData,
    });

    return (
        <Box position="relative">
            <Head>
                <title>Camp Reviews</title>
            </Head>
            <Navbar />

            <Stack
                direction="row"
                gap="1rem"
                px={{ xs: "1rem", md: "4rem" }}
                mt={{ xs: "0px", sm: "96px", md: "144px" }}
                position="relative"
            >
                {/* Left section */}
                <Stack
                    gap="24px"
                    width="100%"
                    maxWidth="400px"
                    height="fit-content"
                    position="sticky"
                    top="96px"
                >
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
                                {Math.round(overallRating * 100) / 100}%
                            </Typography>
                        </Stack>

                        <Divider orientation="vertical" flexItem />
                        <Typography variant="body1" fontWeight="medium">
                            {totalReviews} reviews
                        </Typography>
                    </Stack>
                </Stack>

                {/* Right section */}
                <Stack gap="24px" flexGrow={1} overflow="clip">
                    <Stack
                        flexGrow={1}
                        gap="24px"
                        divider={<Divider sx={{ borderColor: "grey.100" }} />}
                        px="8px"
                    >
                        {data.reviews?.map((review) => {
                            return (
                                <ReviewCard
                                    key={review.id.toString()}
                                    review={review}
                                />
                            );
                        })}
                    </Stack>

                    {/* Pagination */}
                    <Pagination
                        page={page}
                        onChange={(event, value) => setPage(value)}
                        count={Math.ceil(totalReviews / REVIEWS_LIMIT)}
                        variant="outlined"
                        shape="rounded"
                        showLastButton
                        showFirstButton
                        color="primary"
                        size="large"
                        sx={{
                            px: "1rem",
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                            position: "sticky",
                            bottom: 0,
                            width: "100%",
                            bgcolor: "white",
                            height: "60px",
                            borderTop: "1px solid",
                            borderColor: "grey.300",
                        }}
                    />
                </Stack>
            </Stack>
        </Box>
    );
}
