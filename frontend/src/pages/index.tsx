import Navbar from "@app/components/shared/navbar/Navbar";
import { theme } from "@app/lib/styles";
import { Box, styled } from "@mui/material";
import Head from "next/head";

export default function Home() {
    return (
        <Box sx={{ bgcolor: "primary.200" }}>
            <style global jsx>{`
                body {
                    background-color: ${(theme.palette.primary as any)["50"]};
                }
            `}</style>

            <Head>
                <title>Camps for Champs</title>
                <meta name="description" content="Camps for Champs" />
                <link rel="icon" href="/logo-icon.ico" />
            </Head>

            <Navbar />
        </Box>
    );
}
