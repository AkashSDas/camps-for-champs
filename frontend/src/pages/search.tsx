import { CampList } from "@app/components/camp-page/camp-list/CampList";
import { CampSiteMap as CampMap } from "@app/components/camp-page/camp-site-map/CampSiteMap";
import { MobileSearchCampInputButton } from "@app/components/search-camp/search-camp-input-button/MobileSearchCampInputButton";
import { Navbar } from "@app/components/shared/navbar/Navbar";
import { useSearchCamps } from "@app/hooks/camp-search";
import { transformQueryParamsToSearchValues } from "@app/utils/camp";
import {
    Box,
    Button,
    Drawer,
    IconButton,
    Stack,
    SwipeableDrawer,
    styled,
} from "@mui/material";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
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

const Puller = styled("div")(({ theme }) => ({
    width: "100px",
    height: "6px",
    backgroundColor: theme.palette.grey[300],
    borderRadius: 3,
}));

export default function SearchPage() {
    const router = useRouter();
    const filters = useMemo(
        function () {
            if (router.isReady) {
                // This has to be done instead of using router query since the router.replace in CampSiteMap.tsx
                // is happinging where the change method is inside of callback and debounced. This is causing
                // me to get initial query params from the url instead of the router.query

                const params = window.location.search;
                const urlParams = new URLSearchParams(params);

                const location = urlParams.get("location");
                const locationTextInput = urlParams.get("locationTextInput");
                const adultGuestsCount = urlParams.get("adultGuestsCount");
                const childGuestsCount = urlParams.get("childGuestsCount");
                const petsCount = urlParams.get("petsCount");
                const checkInDate = urlParams.get("checkInDate");
                const checkOutDate = urlParams.get("checkOutDate");

                // const searchParams = transformQueryParamsToSearchValues(
                //     router.query
                // );
                const searchParams = transformQueryParamsToSearchValues({
                    location: location ?? "",
                    locationTextInput: locationTextInput ?? "",
                    adultGuestsCount: adultGuestsCount ?? "0",
                    childGuestsCount: childGuestsCount ?? "0",
                    petsCount: petsCount ?? "0",
                    checkInDate: checkInDate ?? "null",
                    checkOutDate: checkOutDate ?? "null",
                });

                const locationParam = searchParams.location;
                if (
                    locationParam &&
                    (locationParam.length !== 4 || locationParam.every(isNaN))
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
    const [showMobileMap, setShowMobileMap] = useState(false);

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
                mt="80px"
                direction="row"
            >
                {!fullMap ? (
                    <Stack
                        gap="1rem"
                        mt={{ xs: "16px", md: "64px" }}
                        mb="4rem"
                        width="100%"
                        position="relative"
                    >
                        <MobileSearchCampInputButton />
                        <CampList {...campsResult} />

                        <Button
                            startIcon={
                                <Image
                                    src="/icons/map-light.png"
                                    alt="Show map"
                                    width={20}
                                    height={20}
                                    style={{ display: "inline-block" }}
                                />
                            }
                            variant="contained"
                            disableElevation
                            sx={{
                                width: "fit-content",
                                px: "1.5rem",
                                position: "fixed",
                                bottom: "2rem",
                                left: "50%",
                                transform: "translateX(-50%)",
                                display: { xs: "flex", md: "none" },
                            }}
                            onClick={() => setShowMobileMap(true)}
                        >
                            Map
                        </Button>

                        <SwipeableDrawer
                            onOpen={() => setShowMobileMap(true)}
                            open={showMobileMap}
                            onClose={() => setShowMobileMap(false)}
                            anchor="bottom"
                        >
                            <Stack
                                sx={{
                                    bgcolor: "white",
                                    height: "30px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Puller />
                            </Stack>
                            <CampSiteMap
                                isPending={
                                    campsResult.fetchingNextPage ||
                                    campsResult.isInitialFetch
                                }
                                camps={campsResult.camps}
                                setFullMap={setFullMap}
                                fullMap={fullMap}
                                variant="mobile"
                            />
                        </SwipeableDrawer>
                    </Stack>
                ) : null}

                <CampSiteMap
                    isPending={
                        campsResult.fetchingNextPage ||
                        campsResult.isInitialFetch
                    }
                    camps={campsResult.camps}
                    setFullMap={setFullMap}
                    fullMap={fullMap}
                    variant="desktop"
                />
            </Stack>
        </Box>
    );
}
