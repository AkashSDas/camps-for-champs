import { type useSearchCamps } from "@app/hooks/camp-search";
import { headingFont, bodyFont } from "@app/pages/_app";
import { Stack, Box, IconButton, Typography, styled } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { type MouseEvent } from "react";
import { ArrowButton } from "./ArrowButton";
import { ImageSliderDots } from "./ImageSliderDots";
import { LikeButton } from "./LikeButton";
import { Tag } from "./Tag";

// ===================================
// Camp Card component
// ===================================

type Props = Pick<
    ReturnType<typeof useSearchCamps>["camps"][number],
    | "id"
    | "about"
    | "name"
    | "images"
    | "averageRating"
    | "perNightCost"
    | "tags"
>;

export function CampCard(props: Props) {
    const [activeStep, setActiveStep] = useState(0);
    const { id, about, name, images, averageRating, perNightCost } = props;
    const showTrending = useMemo(
        function () {
            if (averageRating > 3) return true;
            return false;
        },
        [averageRating]
    );

    /** Handle img next navigation */
    function handleNext(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (activeStep === images.length - 1) {
            window.open(`/camps/${id}`, "_blank");

            return;
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    /** Handle img back navigation */
    function handleBack(e: MouseEvent<HTMLButtonElement>) {
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
                gap="12px"
                sx={{
                    transition: "display 0.3s ease-in-out",
                    cursor: "pointer",
                    "&:hover .camp-card": { display: "flex" },
                }}
            >
                {/* Image slider */}
                <Box
                    sx={{
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
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

                    {showTrending ? <Tag /> : null}
                    <LikeButton />
                    <ImageSliderDots
                        activeIdx={activeStep}
                        totalIndexes={images.length}
                    />

                    <SwipeableViews
                        enableMouseEvents
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        style={{ borderRadius: "14px" }}
                        containerStyle={{ height: "248px" }}
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
                                width={400}
                                height={248}
                                layout="responsive"
                                objectFit="cover"
                            />
                        ))}
                    </SwipeableViews>
                </Box>

                {/* Camp info */}
                <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" gap="0.5rem">
                        <Image
                            src="/icons/like.png"
                            alt="Like camp"
                            width={20}
                            height={20}
                        />

                        <Typography
                            sx={{
                                fontFamily: headingFont.style.fontFamily,
                                fontSize: "1rem",
                                color: "primary.900",
                            }}
                        >
                            {averageRating}%
                        </Typography>

                        <Typography
                            sx={{ fontSize: "1rem", color: "primary.700" }}
                        >
                            (312)
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" gap="0.5rem">
                        <Typography
                            sx={{
                                fontFamily: headingFont.style.fontFamily,
                                fontSize: "1rem",
                                color: "primary.900",
                            }}
                        >
                            ₹{perNightCost}
                        </Typography>

                        <Typography
                            sx={{ fontSize: "1rem", color: "primary.700" }}
                        >
                            /
                        </Typography>
                        <Typography
                            sx={{ fontSize: "1rem", color: "primary.700" }}
                        >
                            night
                        </Typography>
                    </Stack>
                </Stack>

                <Typography
                    variant="h3"
                    sx={(theme) => ({
                        fontFamily: bodyFont.style.fontFamily,
                        fontSize: "18px",
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
