import { Navbar } from "@app/components/shared/navbar/Navbar";
import { Box, Stack } from "@mui/material";
import Head from "next/head";

export default function SearchPage() {
    return (
        <Box position="relative">
            <Head>
                <title>Search Camps</title>
            </Head>
            <Navbar />

            <Stack
                direction={{ xs: "column", md: "row" }}
                gap="1rem"
                px={{ xs: "1rem", md: "4rem" }}
                mt={{ xs: "96px", md: "144px" }}
                position="relative"
            ></Stack>
        </Box>
    );
}
