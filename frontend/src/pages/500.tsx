import { Navbar } from "@app/components/shared/navbar/Navbar";
import { Box, Typography } from "@mui/material";

export default function InternalServerError() {
    return (
        <Box>
            <Navbar />

            <Box
                px={{ xs: "1rem", md: "4rem" }}
                mt={{ xs: "96px", md: "144px" }}
            >
                <Typography variant="body1">
                    Sorry, something went wrong. Please try again later.
                </Typography>
            </Box>
        </Box>
    );
}
