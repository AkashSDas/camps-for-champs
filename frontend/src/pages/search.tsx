import { CampList } from "@app/components/camp-page/camp-list/CampList";
import { CampSiteMap as CampMap } from "@app/components/camp-page/camp-site-map/CampSiteMap";
import { MobileSearchCampInputButton } from "@app/components/search-camp/search-camp-input-button/MobileSearchCampInputButton";
import { Navbar } from "@app/components/shared/navbar/Navbar";
import { useSearchCamps } from "@app/hooks/camp-search";
import { transformQueryParamsToSearchValues } from "@app/utils/camp";
import { Box, Stack } from "@mui/material";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const CampSiteMap = dynamic(
    async function () {
        return import(
            "@app/components/camp-page/camp-site-map/CampSiteMap"
        ).then((mod: any) => mod.CampSiteMap);
    },
    { ssr: false }
) as typeof CampMap;

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
    const [fullMap, setFullMap] = useState(false);

    return (
        <Box position="relative">
            <Head>
                <title>Search Camps</title>
            </Head>
            <Navbar />

            <Stack
                gap="1rem"
                pl={{ xs: "1rem", md: fullMap ? "0px" : "4rem" }}
                pr={{ xs: "1rem", md: "0px" }}
                position="relative"
                direction="row"
            >
                {!fullMap ? (
                    <Stack
                        gap="1rem"
                        mt={{ xs: "96px", md: "144px" }}
                        mb="4rem"
                        width="100%"
                    >
                        <MobileSearchCampInputButton />
                        <CampList {...campsResult} />
                    </Stack>
                ) : null}

                <CampSiteMap
                    camps={campsResult.camps}
                    setFullMap={setFullMap}
                    fullMap={fullMap}
                />
            </Stack>
        </Box>
    );
}
