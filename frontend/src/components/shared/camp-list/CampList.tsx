import { useSearchCamps } from "@app/hooks/camp-search";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { CampCard } from "./CampCard";
import { CampListSkeleton } from "./GridListSkeleton";
import Image from "next/image";

export function CampList() {
    const {
        camps,
        count,
        isInitialFetch,
        fetchingNextPage,
        isError,
        hasMore,
        fetchNextPage,
    } = useSearchCamps({}, 5, 1);

    function handleLoadMore() {
        if (hasMore) {
            fetchNextPage();
        }
    }

    if (isError || camps.length === 0) {
        return (
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                mt="5rem"
                width="100%"
                maxWidth="1312px"
                gap="1rem"
            >
                <Image
                    src="/icons/cry-emoji.png"
                    alt="No results found"
                    width={60}
                    height={60}
                />

                <Typography variant="h4">
                    {isError
                        ? "Something went wrong. Please try again later."
                        : "No results found."}
                </Typography>
            </Stack>
        );
    } else if (isInitialFetch) {
        return <CampListSkeleton />;
    }

    return (
        <Stack alignItems="start" width="100%" maxWidth="1312px">
            <Typography variant="h4" mb="2rem">
                {count} places
            </Typography>

            <Grid
                container
                columnSpacing={3}
                rowSpacing={3}
                direction="row"
                columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
            >
                {camps.map((camp) => {
                    return (
                        <Grid
                            item
                            key={camp.id.toString()}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={4}
                            xl={4}
                        >
                            <CampCard
                                id={camp.id}
                                about={camp.about}
                                name={camp.name}
                                images={camp.images}
                                averageRating={camp.averageRating}
                                perNightCost={camp.perNightCost}
                                tags={camp.tags}
                            />
                        </Grid>
                    );
                })}
            </Grid>

            {hasMore ? (
                <Button
                    variant="contained"
                    disableElevation
                    onClick={handleLoadMore}
                    disabled={fetchingNextPage}
                    sx={{
                        borderRadius: "14px",
                        mt: "4rem",
                        mx: "auto",
                        minWidth: "280px",
                        height: "60px",
                    }}
                    startIcon={
                        <Image
                            src="/icons/eye-emoji.png"
                            alt="See more camps"
                            width={28}
                            height={22}
                        />
                    }
                >
                    {fetchingNextPage
                        ? "Loading more camps..."
                        : "See more camps"}
                </Button>
            ) : (
                <Typography
                    variant="body1"
                    mt="4rem"
                    textAlign="center"
                    width="100%"
                    fontSize="24px"
                    fontWeight="bold"
                >
                    {`That's all the camps we have for you!`}
                </Typography>
            )}
        </Stack>
    );
}
