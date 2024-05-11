import { CampList } from "@app/components/search-camp/camp-list/CampList";
import { MobileSearchCampInputButton } from "@app/components/search-camp/search-camp-input-button/MobileSearchCampInputButton";
import { Navbar } from "@app/components/shared/navbar/Navbar";
import { useSearchCamps } from "@app/hooks/camp-search";
import { transformQueryParamsToSearchValues } from "@app/utils/camp";
import { Box, Stack } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function SearchPage() {
    const router = useRouter();
    const filters = useMemo(
        function () {
            if (router.isReady) {
                const searchParams = transformQueryParamsToSearchValues(
                    router.query as Record<string, string>
                );
                let location = searchParams.location;
                if (
                    location &&
                    (location.length !== 4 || location.every(isNaN))
                ) {
                    searchParams.location = undefined;
                }
                return searchParams;
            }

            return {};
        },
        [router.isReady, router.query]
    );
    const campsResult = useSearchCamps(filters);

    return (
        <Box position="relative">
            <Head>
                <title>Search Camps</title>
            </Head>
            <Navbar />

            <Stack
                gap="1rem"
                px={{ xs: "1rem", md: "4rem" }}
                mt={{ xs: "96px", md: "144px" }}
                position="relative"
                mb="4rem"
            >
                <MobileSearchCampInputButton />
                <CampList {...campsResult} />
            </Stack>
        </Box>
    );
}
