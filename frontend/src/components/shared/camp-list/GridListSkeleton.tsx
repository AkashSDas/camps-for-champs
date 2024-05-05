import { Stack, Skeleton, Grid } from "@mui/material";

const campSkeletons: null[] = Array(10).fill(null);

export function CampListSkeleton() {
    return (
        <Stack width="100%" maxWidth="1312px">
            <Skeleton
                variant="text"
                sx={(theme) => ({
                    fontSize: theme.typography.h3.fontSize,
                    width: "15%",
                    bgcolor: "grey.300",
                    [theme.breakpoints.down("sm")]: {
                        width: "35%",
                        fontSize: theme.typography.h4.fontSize,
                    },
                })}
            />

            <Grid
                container
                columnSpacing={3}
                rowSpacing={3}
                direction="row"
                columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
            >
                {campSkeletons
                    .slice(0, campSkeletons.length)
                    .map((_, index) => (
                        <Grid
                            item
                            key={index.toString()}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={4}
                            xl={4}
                        >
                            <Skeleton
                                variant="rounded"
                                height="248px"
                                sx={{
                                    borderRadius: "14px",
                                    bgcolor: "grey.300",
                                    mb: "12px",
                                }}
                            />

                            <Skeleton
                                variant="rounded"
                                height="30px"
                                sx={{ bgcolor: "grey.300" }}
                            />
                        </Grid>
                    ))}
            </Grid>
        </Stack>
    );
}
