import { CampBookingCard } from "@app/components/camp-page/camp-booking-card/CampBookingCard";
import { CampHightlightFeatures } from "@app/components/camp-page/camp-highlight-features/CampHightlightFeatures";
import { FeatureCard } from "@app/components/camp-page/feature-card/FeatureCard";
import { ImageGallery } from "@app/components/camp-page/image-gallery/ImageGallery";
import { InfoHeader } from "@app/components/camp-page/info-header/InfoHeader";
import { CampReviewsList } from "@app/components/reviews/camp-reviews-list";
import { type CampSiteMap as CampSiteMapComponent } from "@app/components/shared/maps/CampSiteMap";
import { Navbar } from "@app/components/shared/navbar/Navbar";
import { bodyFont, headingFont } from "@app/pages/_app";
import { FetchedCamp, getCamp } from "@app/services/camps";
import { formatDateTime } from "@app/utils/datetime";
import {
    Box,
    Button,
    Divider,
    Drawer,
    Stack,
    SwipeableDrawer,
    Typography,
} from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { useMemo, useState } from "react";

const CampSiteMap = dynamic(
    async function () {
        return import("@app/components/shared/maps/CampSiteMap").then(
            (mod: any) => mod.CampSiteMap
        );
    },
    { ssr: false }
) as typeof CampSiteMapComponent;

export const getServerSideProps = async function (context) {
    const { campId } = context.query;
    if (typeof campId !== "string" || isNaN(parseInt(campId, 10))) {
        return { notFound: true };
    }

    const res = await getCamp(parseInt(campId, 10));
    if (!res.success || res.camp == null) {
        return { notFound: true };
    }

    return {
        props: { camp: res.camp },
    };
} satisfies GetServerSideProps;

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function CampInfo(props: Props) {
    const { camp } = props;
    const {
        name,
        address,
        overallRating,
        totalReviews,
        images,
        reviews,
        id,
        checkInAt,
        checkOutAt,
        perNightCost,
    } = camp;

    const [checkInTime, checkOutTime] = useMemo(
        function formatTime() {
            const checkInDate = new Date();
            checkInDate.setHours(parseInt(checkInAt.split(":")[0], 10));
            checkInDate.setMinutes(parseInt(checkInAt.split(":")[1], 10));
            const checkInTime = formatDateTime(
                checkInDate.toISOString(),
                "hh:mm am/pm"
            );

            const checkOutDate = new Date();
            checkOutDate.setHours(parseInt(checkOutAt.split(":")[0], 10));
            checkOutDate.setMinutes(parseInt(checkOutAt.split(":")[1], 10));
            const checkOutTime = formatDateTime(
                checkOutDate.toISOString(),
                "hh:mm am/pm"
            );

            return [checkInTime, checkOutTime];
        },
        [checkInAt, checkOutAt]
    );

    return (
        <Box position="relative">
            <Head>
                <title>{camp.name}</title>
                <meta name="description" content={camp.about} />
                <meta property="og:title" content={camp.name} />
                <meta property="og:description" content={camp.about} />
                <meta property="og:image" content={camp.images[0].image} />
            </Head>

            <Navbar />

            <Stack
                mt={{ xs: "96px", md: "144px" }}
                pb="2rem"
                position="relative"
            >
                {/* Basic camp info */}

                <Box px={{ xs: "1rem", md: "4rem" }} mb="2rem">
                    <InfoHeader
                        name={name}
                        address={address}
                        overallRating={overallRating}
                        totalReviews={totalReviews}
                    />
                </Box>

                {/* Camp images */}

                <Box px={{ xs: "1rem", md: "4rem" }} mb="48px">
                    <ImageGallery images={images} />
                </Box>

                <Stack direction="row" gap="1rem" position="relative">
                    <Stack
                        flexGrow={1}
                        gap="48px"
                        divider={<Divider sx={{ borderColor: "grey.100" }} />}
                        px={{ xs: "1rem", md: "4rem" }}
                    >
                        <CampHightlightFeatures
                            features={camp.features.filter(
                                (f) => f.feature.featureType === "highlight"
                            )}
                        />

                        <Typography component="div" whiteSpace="pre-line">
                            {camp.about}
                        </Typography>

                        <Box>
                            <Typography
                                variant="h2"
                                fontFamily={bodyFont.style.fontFamily}
                                fontSize="24px"
                                fontWeight="bold"
                                mb="1.5rem"
                            >
                                Activities
                            </Typography>

                            <Stack direction="row" flexWrap="wrap" gap="18px">
                                {camp.features
                                    .filter(
                                        (f) =>
                                            f.feature.featureType === "activity"
                                    )
                                    .map((feature) => (
                                        <FeatureCard
                                            key={feature.id.toString()}
                                            feature={feature}
                                        />
                                    ))}
                            </Stack>
                        </Box>

                        <Box>
                            <Typography
                                variant="h2"
                                fontFamily={bodyFont.style.fontFamily}
                                fontSize="24px"
                                fontWeight="bold"
                                mb="1.5rem"
                            >
                                Natural Features
                            </Typography>

                            <Stack direction="row" flexWrap="wrap" gap="18px">
                                {camp.features
                                    .filter(
                                        (f) =>
                                            f.feature.featureType ===
                                            "surrounding"
                                    )
                                    .map((feature) => (
                                        <FeatureCard
                                            key={feature.id.toString()}
                                            feature={feature}
                                        />
                                    ))}
                            </Stack>
                        </Box>

                        <Box>
                            <Typography
                                variant="h2"
                                fontFamily={bodyFont.style.fontFamily}
                                fontSize="24px"
                                fontWeight="bold"
                                mb="1.5rem"
                            >
                                Getting There
                            </Typography>

                            <Stack gap="8px">
                                <Stack direction="row" gap="12px">
                                    <Typography
                                        fontWeight="semibold"
                                        color="gray.900"
                                    >
                                        Check in:
                                    </Typography>

                                    <Typography>{checkInTime}</Typography>
                                </Stack>

                                <Stack direction="row" gap="12px">
                                    <Typography
                                        fontWeight="semibold"
                                        color="gray.900"
                                    >
                                        Check out:
                                    </Typography>

                                    <Typography>{checkOutTime}</Typography>
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Camp site map */}

                        <Box>
                            <Typography
                                variant="h2"
                                fontFamily={bodyFont.style.fontFamily}
                                fontSize="24px"
                                fontWeight="bold"
                                mb="1.5rem"
                            >
                                Site Map
                            </Typography>

                            <CampSiteMap
                                latitude={camp.latitude}
                                longitude={camp.longitude}
                                perNightCost={perNightCost}
                            />

                            <Typography
                                variant="body1"
                                fontWeight="medium"
                                mt="1.5rem"
                            >
                                {address}
                            </Typography>
                        </Box>

                        <CampReviewsList
                            id={id}
                            overallRating={overallRating}
                            totalReviews={totalReviews}
                            reviews={reviews}
                        />
                    </Stack>

                    <Box
                        pr={{ xs: "1rem", md: "4rem" }}
                        pl={0}
                        position="sticky"
                        top="6rem"
                        display={{ xs: "none", md: "block" }}
                    >
                        <CampBookingCard perNightCost={perNightCost} />
                    </Box>
                </Stack>
            </Stack>

            {/* Mobile bottom navigation */}
            <MobileBottomNavigation perNightCost={perNightCost} />
        </Box>
    );
}

type MobileBottomNavigationProps = Pick<FetchedCamp, "perNightCost">;

function MobileBottomNavigation(props: MobileBottomNavigationProps) {
    const { perNightCost } = props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <Stack
                position="sticky"
                bottom={0}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                borderTop="1px solid"
                borderColor="grey.300"
                height="60px"
                px="1rem"
                width="100%"
                bgcolor="white"
                zIndex={100}
                display={{ xs: "flex", md: "none" }}
                boxShadow={{ xs: "0px -4px 8px rgba(142, 152, 168, 0.05)" }}
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

                <Button
                    variant="contained"
                    sx={{ fontFamily: headingFont.style.fontFamily }}
                    disableElevation
                    onClick={() => setOpen(true)}
                    startIcon={
                        <Image
                            src="/figmoji/tent-with-tree.png"
                            alt="Tent with Tree"
                            width={23.81}
                            height={23.42}
                            style={{ display: "inline-block" }}
                        />
                    }
                >
                    Book
                </Button>
            </Stack>

            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                sx={{ display: { xs: "block", md: "none" } }}
            >
                <CampBookingCard fullscreen perNightCost={perNightCost} />
            </SwipeableDrawer>
        </>
    );
}
