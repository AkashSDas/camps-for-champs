import { CampCard } from "@app/components/shared/camp-list/CampCard";
import { CampListSkeleton } from "@app/components/shared/camp-list/GridListSkeleton";
import { Navbar } from "@app/components/shared/navbar/Navbar";
import { useLikeCamp } from "@app/hooks/like-camps";
import { Box, Grid, Typography, Stack } from "@mui/material";
import Head from "next/head";

export default function LikedCampsPage(): React.JSX.Element {
    const { getCamps } = useLikeCamp();
    const { camps, isLoading } = getCamps;

    return (
        <Box position="relative">
            <Head>
                <title>Liked Camps</title>
            </Head>
            <Navbar />

            <Stack
                alignItems="start"
                justifyContent="start"
                gap="48px"
                mt="118px"
                mx={{ xs: "1rem", sm: "2rem", md: "3rem", lg: "4rem" }}
                sx={(theme) => ({
                    [theme.breakpoints.down("sm")]: { mt: "102px" },
                })}
            >
                {isLoading ? (
                    <CampListSkeleton />
                ) : (
                    <Stack alignItems="start" width="100%" maxWidth="1312px">
                        <Typography variant="h4" mb="2rem">
                            Liked Camps
                        </Typography>

                        <Grid
                            container
                            columnSpacing={3}
                            rowSpacing={{
                                xs: 6,
                                sm: 3,
                                md: 3,
                                lg: 3,
                                xl: 3,
                            }}
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
                                            overallRating={camp.overallRating}
                                            totalReviews={camp.totalReviews}
                                            perNightCost={camp.perNightCost}
                                            tags={camp.tags}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}
