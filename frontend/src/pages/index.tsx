import { Navbar } from "@app/components/shared/navbar/Navbar";
import { theme } from "@app/lib/styles";
import { Box, Stack } from "@mui/material";
import Head from "next/head";
import { Banner } from "@app/components/shared/banner/Banner";
import { SearchCampsInput as SearchInput } from "@app/components/shared/search-camps-input/SearchCampsInput";
import dynamic from "next/dynamic";
import { CampList } from "@app/components/shared/camp-list/CampList";
import { useRouter } from "next/router";

const SearchCampsInput = dynamic(
    async function () {
        return import(
            "@app/components/shared/search-camps-input/SearchCampsInput"
        ).then((mod: any) => mod.SearchCampsInput);
    },
    { ssr: false }
) as typeof SearchInput;

export default function Home() {
    const router = useRouter();

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
                justifyContent="center"
                gap="48px"
                mt="118px"
                mx="1rem"
                sx={(theme) => ({
                    [theme.breakpoints.down("sm")]: { mt: "24px" },
                })}
            >
                <Banner />
                <SearchCampsInput
                    rootSx={(theme) => ({
                        [theme.breakpoints.down("sm")]: { mt: "4rem" },
                    })}
                    elevation
                    onSearchClick={async (searchValues) => {
                        const searchParams = new URLSearchParams(
                            searchValues as any
                        );
                        router.push(`/search?${searchParams.toString()}`);
                    }}
                />
                <CampList />
            </Stack>
        </Box>
    );
}
