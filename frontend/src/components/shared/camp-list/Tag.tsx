import { headingFont } from "@app/pages/_app";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";

export function Tag() {
    return (
        <Stack
            sx={{
                borderRadius: "8px",
                zIndex: 4,
                position: "absolute",
                top: "1rem",
                left: "1rem",
                bgcolor: "white",
                px: "0.5rem",
                height: "30px",
                color: "primary.900",
            }}
            gap="0.5rem"
            justifyContent="center"
            alignItems="center"
            direction="row"
        >
            <Image
                src="/figmoji/fire-emoji.png"
                alt="Trending camp"
                width={14}
                height={14}
            />

            <Typography
                variant="body2"
                fontWeight="bold"
                fontFamily={headingFont.style.fontFamily}
            >
                Trending
            </Typography>
        </Stack>
    );
}
