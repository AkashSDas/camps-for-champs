import { Navbar } from "@app/components/shared/navbar/Navbar";
import { theme } from "@app/lib/styles";
import { Box } from "@mui/material";
import Head from "next/head";
import { SearchCampsInput } from "@app/components/shared/search-camps-input/SearchCampsInput";

export default function Home() {
    return (
        <Box>
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

            <SearchCampsInput />
        </Box>
    );
}
