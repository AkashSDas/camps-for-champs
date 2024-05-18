import { ArrowButton } from "@app/components/shared/camp-list/ArrowButton";
import { ImageSliderDots } from "@app/components/shared/camp-list/ImageSliderDots";
import { LikeButton } from "@app/components/shared/camp-list/LikeButton";
import { bodyFont, headingFont } from "@app/pages/_app";
import { type FetchedCamp } from "@app/services/camps";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useMemo, useState } from "react";
import SwipeableViews from "react-swipeable-views";

type Props = {
    camp: Pick<
        FetchedCamp,
        | "id"
        | "about"
        | "name"
        | "images"
        | "overallRating"
        | "totalReviews"
        | "perNightCost"
        | "tags"
    >;
};

export function CampCardMapMarker(props: Props) {
    const { camp } = props;
    const {
        id,
        about,
        name,
        images,
        overallRating,
        totalReviews,
        perNightCost,
    } = camp;
    const [activeStep, setActiveStep] = useState(0);

    const showTrending = useMemo(
        function () {
            if (overallRating > 65) return true;
            return false;
        },
        [overallRating]
    );

    /** Handle img next navigation */
    function handleNext(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        e.preventDefault();
        if (activeStep === images.length - 1) {
            window.open(`/camps/${id}`, "_blank");

            return;
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    /** Handle img back navigation */
    function handleBack(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        e.preventDefault();
        if (activeStep === 0) {
            setActiveStep(images.length - 1);
            return;
        }
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }

    /** Handle img swipe navigation */
    function handleStepChange(step: number): void {
        setActiveStep(step);
    }

    return (
        <Link href={`/camps/${id}`} passHref target="_blank">
            <Stack
                gap="8px"
                sx={{
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                    bgcolor: "white",
                    borderRadius: "12px",
                    transition: "display 0.3s ease-in-out",
                    cursor: "pointer",
                    "&:hover .camp-card": { display: "flex" },
                    pb: "8px",
                }}
            >
                {/* Image slider */}
                <Box sx={{ position: "relative", overflow: "hidden" }}>
                    <Stack
                        className="camp-card"
                        zIndex={1}
                        position="absolute"
                        display="none"
                        top="50%"
                        left="0"
                        right="0"
                        width="100%"
                        justifyContent="space-around"
                        sx={{ transition: "display 0.3s ease-in-out" }}
                    >
                        <ArrowButton
                            aria-label="back"
                            sx={{
                                left: "1rem",
                                bgcolor: "white",
                                "&:hover": {
                                    bgcolor: "grey.200",
                                },
                                "&:active": {
                                    bgcolor: "grey.400",
                                },
                            }}
                            onClick={handleBack}
                        >
                            <Image
                                src="/icons/back-arrow.png"
                                alt="Left arrow"
                                width={20}
                                height={20}
                            />
                        </ArrowButton>

                        <ArrowButton
                            aria-label="next"
                            sx={{
                                right: "1rem",
                                bgcolor: "white",
                                "&:hover": {
                                    bgcolor: "grey.200",
                                },
                                "&:active": {
                                    bgcolor: "grey.400",
                                },
                            }}
                            onClick={handleNext}
                        >
                            <Image
                                src="/icons/forward-arrow.png"
                                alt="Left arrow"
                                width={20}
                                height={20}
                            />
                        </ArrowButton>
                    </Stack>

                    <LikeButton />
                    <ImageSliderDots
                        activeIdx={activeStep}
                        totalIndexes={images.length}
                    />

                    <SwipeableViews
                        enableMouseEvents
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        style={{
                            borderRadius: "14px",
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                        }}
                        containerStyle={{ height: "178px" }}
                        slideStyle={{ overflowY: "hidden" }}
                    >
                        {images.map((image, index) => (
                            <Image
                                className="camp-preview-img"
                                key={index}
                                // src={image.image}
                                src={
                                    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                }
                                alt={name}
                                width={200}
                                height={178}
                                layout="responsive"
                                objectFit="cover"
                            />
                        ))}
                    </SwipeableViews>
                </Box>
                {/* Camp info */}
                <Stack direction="row" justifyContent="space-between" px="8px">
                    <Stack direction="row" alignItems="center" gap="2px">
                        <Image
                            src="/icons/like.png"
                            alt="Like camp"
                            width={20}
                            height={20}
                        />

                        <Typography
                            sx={{
                                fontFamily: headingFont.style.fontFamily,
                                fontSize: "0.75rem",
                                color: "primary.900",
                            }}
                        >
                            {overallRating}%
                        </Typography>

                        <Typography
                            sx={{ fontSize: "0.75rem", color: "primary.700" }}
                        >
                            ({totalReviews})
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" gap="2px">
                        <Typography
                            sx={{
                                fontFamily: headingFont.style.fontFamily,
                                fontSize: "0.75rem",
                                color: "primary.900",
                            }}
                        >
                            ₹{perNightCost}
                        </Typography>

                        <Typography
                            sx={{ fontSize: "0.75rem", color: "primary.700" }}
                        >
                            /
                        </Typography>
                        <Typography
                            sx={{ fontSize: "0.75rem", color: "primary.700" }}
                        >
                            night
                        </Typography>
                    </Stack>
                </Stack>
                <Typography
                    variant="h3"
                    sx={(theme) => ({
                        fontFamily: bodyFont.style.fontFamily,
                        fontSize: "14px",
                        px: "8px",
                        fontWeight: "bold",
                        color: "primary.900",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical",
                    })}
                >
                    {name}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        px: "8px",
                        fontSize: "14px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {about}
                </Typography>
            </Stack>
        </Link>
    );
}
