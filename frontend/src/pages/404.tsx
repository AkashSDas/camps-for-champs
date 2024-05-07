import { Navbar } from "@app/components/shared/navbar/Navbar";
import { Box, Typography } from "@mui/material";

export default function NotFound() {
    return (
        <Box>
            <Navbar />

            <Box
                px={{ xs: "1rem", md: "4rem" }}
                mt={{ xs: "96px", md: "144px" }}
            >
                <Typography variant="body1">
                    {`Resource you're looking for doesn't exists.`}
                </Typography>
            </Box>
        </Box>
    );
}
