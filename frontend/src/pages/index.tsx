import { Navbar } from "@app/components/shared/navbar/Navbar";
import { theme } from "@app/lib/styles";
import { Box, Stack } from "@mui/material";
import Head from "next/head";
import { SearchCampsInput } from "@app/components/shared/search-camps-input/SearchCampsInput";
import { Banner } from "@app/components/shared/banner/Banner";

export default function Home() {
    return (
        <Box mb="6rem">
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

            <Navbar variant="light" />

            <Stack
                alignItems="center"
                gap="48px"
                mt="118px"
                mx="1rem"
                sx={(theme) => ({
                    [theme.breakpoints.down("sm")]: {
                        mt: "24px",
                    },
                })}
            >
                <Banner />
                <SearchCampsInput
                    elevation
                    onSearchClick={(searchValues) => {
                        console.log({ searchValues });
                    }}
                />
            </Stack>
        </Box>
    );
}
