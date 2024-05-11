import { Stack, Box } from "@mui/material";

type ImageSliderDotsProps = {
    activeIdx: number;
    totalIndexes: number;
};

export function ImageSliderDots(props: ImageSliderDotsProps) {
    return (
        <Stack
            position="absolute"
            bottom="1rem"
            left="0"
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap="0.5rem"
            zIndex={2}
            width="100%"
        >
            {Array.from({ length: props.totalIndexes }).map((_, index) => (
                <Box
                    key={index}
                    sx={{
                        width: props.activeIdx === index ? "12px" : "8px",
                        height: props.activeIdx === index ? "12px" : "8px",
                        borderRadius: "50%",
                        opacity: props.activeIdx === index ? 1 : 0.5,
                        bgcolor: "white",
                    }}
                />
            ))}
        </Stack>
    );
}
