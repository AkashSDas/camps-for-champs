import { CampHightlightFeatures } from "@app/components/camp-page/camp-highlight-features/CampHightlightFeatures";
import { FeatureCard } from "@app/components/camp-page/feature-card/FeatureCard";
import { ImageGallery } from "@app/components/camp-page/image-gallery/ImageGallery";
import { InfoHeader } from "@app/components/camp-page/info-header/InfoHeader";
import { CampReviewsList } from "@app/components/reviews/camp-reviews-list";
import { Navbar } from "@app/components/shared/navbar/Navbar";
import { bodyFont } from "@app/pages/_app";
import { getCamp } from "@app/services/camps";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";

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
    const { name, address, overallRating, totalReviews, images, reviews, id } =
        camp;

    return (
        <Box>
            <Head>
                <title>{camp.name}</title>
                <meta name="description" content={camp.about} />
                <meta property="og:title" content={camp.name} />
                <meta property="og:description" content={camp.about} />
                <meta property="og:image" content={camp.images[0].image} />
            </Head>

            <Navbar />

            <Box mt={{ xs: "96px", md: "144px" }} mb="2rem">
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

                {/* Camp features */}

                <Box px={{ xs: "1rem", md: "4rem" }} mb="48px">
                    <CampHightlightFeatures
                        features={camp.features.filter(
                            (f) => f.feature.featureType === "highlight"
                        )}
                    />
                </Box>

                <Box px={{ xs: "1rem", md: "4rem" }} mb="48px">
                    <Divider sx={{ borderColor: "grey.100" }} />
                </Box>

                {/* Camp description */}

                <Box px={{ xs: "1rem", md: "4rem" }} mb="48px">
                    <Typography component="div" whiteSpace="pre-line">
                        {camp.about}
                    </Typography>
                </Box>

                <Box px={{ xs: "1rem", md: "4rem" }} mb="48px">
                    <Divider sx={{ borderColor: "grey.100" }} />
                </Box>

                {/* Camp activities */}

                <Box px={{ xs: "1rem", md: "4rem" }} mb="48px">
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
                            .filter((f) => f.feature.featureType === "activity")
                            .map((feature) => (
                                <FeatureCard
                                    key={feature.id.toString()}
                                    feature={feature}
                                />
                            ))}
                    </Stack>
                </Box>

                <Box px={{ xs: "1rem", md: "4rem" }} mb="48px">
                    <Divider sx={{ borderColor: "grey.100" }} />
                </Box>

                {/* Camp surroundings */}

                <Box px={{ xs: "1rem", md: "4rem" }} mb="48px">
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
                                (f) => f.feature.featureType === "surrounding"
                            )
                            .map((feature) => (
                                <FeatureCard
                                    key={feature.id.toString()}
                                    feature={feature}
                                />
                            ))}
                    </Stack>
                </Box>

                <Box px={{ xs: "1rem", md: "4rem" }} mb="48px">
                    <Divider sx={{ borderColor: "grey.100" }} />
                </Box>

                {/* Camp reviews */}

                <CampReviewsList
                    id={id}
                    overallRating={overallRating}
                    totalReviews={totalReviews}
                    reviews={reviews}
                />
            </Box>
        </Box>
    );
}
