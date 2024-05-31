import { CampBookingCard } from "@app/components/camp-page/camp-booking-card/CampBookingCard";
import { MobileBottomNavigation } from "@app/components/camp-page/mobile-bottom-navigation/MobileBottomNavigation";
import { CampHightlightFeatures } from "@app/components/camp-page/camp-highlight-features/CampHightlightFeatures";
import { FeatureCard } from "@app/components/camp-page/feature-card/FeatureCard";
import { ImageGallery } from "@app/components/camp-page/image-gallery/ImageGallery";
import { MobileImageGallery } from "@app/components/camp-page/image-gallery/MobileImageGallery";
import { InfoHeader } from "@app/components/camp-page/info-header/InfoHeader";
import { MobileInfoHeader } from "@app/components/camp-page/info-header/MobileInfoHeader";
import { CampReviewsList } from "@app/components/reviews/camp-reviews-list";
import { type CampSiteMap as CampSiteMapComponent } from "@app/components/shared/maps/CampSiteMap";
import { Navbar } from "@app/components/shared/navbar/Navbar";
import { bodyFont } from "@app/pages/_app";
import { getCamp } from "@app/services/camps";
import { formatDateTime } from "@app/utils/datetime";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useMemo } from "react";

const CampSiteMap = dynamic(
    async function () {
        return import("@app/components/shared/maps/CampSiteMap").then(
            (mod: any) => mod.CampSiteMap
        );
    },
    { ssr: false }
) as typeof CampSiteMapComponent;

export const config = {
    runtime: "nodejs", // or "edge"
};

export const getServerSideProps = async function (context) {
    const { res } = context;
    res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate"); // 1 second

    const { campId } = context.query;
    if (typeof campId !== "string" || Number.isNaN(parseInt(campId, 10))) {
        return { notFound: true };
    }

    const result = await getCamp(parseInt(campId, 10));
    if (!result.success || result.camp == null) {
        return { notFound: true };
    }

    return {
        props: { camp: result.camp },
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
                mt={{ xs: "0px", sm: "96px", md: "144px" }}
                pb="2rem"
                position="relative"
            >
                {/* Basic camp info */}
                <Box px={{ xs: "1rem", md: "4rem" }} mb="2rem">
                    <InfoHeader
                        id={id}
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

                <MobileImageGallery images={images} name={name} />

                <Stack
                    direction="row"
                    gap={{ xs: "0px", md: "1rem" }}
                    position="relative"
                >
                    <Stack
                        flexGrow={1}
                        gap="48px"
                        divider={<Divider sx={{ borderColor: "grey.100" }} />}
                        px={{ xs: "1rem", md: "4rem" }}
                    >
                        {/* Basic camp info */}
                        <MobileInfoHeader
                            name={name}
                            address={address}
                            overallRating={overallRating}
                            totalReviews={totalReviews}
                        />

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
                        height="fit-content"
                        display={{ xs: "none", md: "block" }}
                    >
                        <CampBookingCard perNightCost={perNightCost} id={id} />
                    </Box>
                </Stack>
            </Stack>

            {/* Mobile bottom navigation */}
            <MobileBottomNavigation perNightCost={perNightCost} id={id} />
        </Box>
    );
}
