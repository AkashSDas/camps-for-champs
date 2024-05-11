import { CampList } from "@app/components/search-camp/camp-list/CampList";
import { Navbar } from "@app/components/shared/navbar/Navbar";
import { useSearchCamps } from "@app/hooks/camp-search";
import { MapboxBBox } from "@app/hooks/mapbox";
import { Box, Stack } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { z } from "zod";

const searchParamsSchema = z
    .object({
        location: z.string().optional(),
        checkInDate: z.string().optional(),
        checkOutDate: z.string().optional(),
        adultGuestsCount: z.string().optional(),
        childGuestsCount: z.string().optional(),
        petsCount: z.string().optional(),
    })
    .transform((data) => {
        return {
            location: (data.location &&
            data.location !== "null" &&
            data.location !== "undefined"
                ? data.location.split(",").map(parseFloat)
                : undefined) as MapboxBBox | undefined,
            checkInDate:
                data.checkInDate &&
                data.checkInDate !== "null" &&
                data.checkInDate !== "undefined"
                    ? new Date(data.checkInDate)
                    : undefined,
            checkOutDate:
                data.checkOutDate &&
                data.checkOutDate !== "null" &&
                data.checkOutDate !== "undefined"
                    ? new Date(data.checkOutDate)
                    : undefined,
            adultGuestsCount:
                data.adultGuestsCount &&
                data.adultGuestsCount !== "null" &&
                data.adultGuestsCount !== "undefined"
                    ? parseInt(data.adultGuestsCount, 10)
                    : 0,
            childGuestsCount:
                data.childGuestsCount &&
                data.childGuestsCount !== "null" &&
                data.childGuestsCount !== "undefined"
                    ? parseInt(data.childGuestsCount, 10)
                    : 0,
            petsCount:
                data.petsCount &&
                data.petsCount !== "null" &&
                data.petsCount !== "undefined"
                    ? parseInt(data.petsCount, 10)
                    : 0,
        };
    });

function transformQueryParamsToSearchValues(
    query: Record<string, string>
): z.infer<typeof searchParamsSchema> {
    let {
        location,
        checkInDate,
        checkOutDate,
        adultGuestsCount,
        childGuestsCount,
        petsCount,
    } = query;

    let searchValues = searchParamsSchema.parse({
        location,
        checkInDate,
        checkOutDate,
        adultGuestsCount,
        childGuestsCount,
        petsCount,
    });

    return searchValues;
}

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
                direction={{ xs: "column", md: "row" }}
                gap="1rem"
                px={{ xs: "1rem", md: "4rem" }}
                mt={{ xs: "96px", md: "144px" }}
                position="relative"
                mb="4rem"
            >
                <CampList {...campsResult} />
            </Stack>
        </Box>
    );
}
