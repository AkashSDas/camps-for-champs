import { FetchedCamp } from "@app/services/camps";
import { Box, Stack } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import SwipeableViews from "react-swipeable-views";

const DUMMY_IMG =
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

type Props = Pick<FetchedCamp, "images" | "name">;

export function MobileImageGallery(props: Props) {
    const { images, name } = props;
    const [activeStep, setActiveStep] = useState(0);

    function handleStepChange(step: number) {
        setActiveStep(step);
    }

    return (
        <Box
            mb="1.5rem"
            position="relative"
            display={{ xs: "block", sm: "none" }}
        >
            <Stack
                sx={{
                    borderRadius: "20px",
                    px: "12px",
                    bgcolor: "grey.900",
                    border: "1px solid",
                    borderColor: "primary.900",
                    color: "white",
                    position: "absolute",
                    bottom: "0.5rem",
                    right: "0.5rem",
                    zIndex: 1,
                    height: "30px",
                    fontWeight: "semibold",
                }}
                justifyContent={"center"}
                alignItems={"center"}
            >
                {activeStep + 1} / {images.length}
            </Stack>

            <SwipeableViews
                enableMouseEvents
                index={activeStep}
                onChangeIndex={handleStepChange}
                containerStyle={{ height: "300px" }}
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
                        height={300}
                        layout="responsive"
                        objectFit="cover"
                    />
                ))}
            </SwipeableViews>
        </Box>
    );
}
