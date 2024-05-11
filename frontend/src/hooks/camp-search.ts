import { searchCamps } from "@app/services/camps";
import {
    useSearchCampInputStore,
    type SearchCampInputStore,
} from "@app/store/search-camp-input";
import { type MapboxBBox } from "./mapbox";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { transformQueryParamsToSearchValues } from "@app/utils/camp";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

export type SearchCampsQueryValues = Pick<
    SearchCampInputStore,
    | "adultGuestsCount"
    | "childGuestsCount"
    | "petsCount"
    | "checkInDate"
    | "checkOutDate"
> & {
    location?: MapboxBBox | undefined;
};

export function useSearchCamps(
    searchValues: Partial<SearchCampsQueryValues> = {},
    limit = 5,
    page = 1
) {
    const {
        data,
        error,
        isError,
        fetchNextPage,
        hasNextPage,
        status,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: [
            "searchCamps",
            searchValues.adultGuestsCount,
            searchValues.childGuestsCount,
            searchValues.petsCount,
            searchValues.location,
            searchValues.checkInDate,
            searchValues.checkOutDate,
        ],
        queryFn: ({ pageParam }) => searchCamps(searchValues, limit, pageParam),
        initialPageParam: page,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.next) {
                const nextPage = parseInt(lastPage.next.split("page=")[1], 10);
                if (!isNaN(nextPage)) return nextPage;
            }
        },
    });

    return {
        camps: data?.pages.flatMap((page) => page.camps ?? []) ?? [],
        count: data?.pages[0]?.count ?? 0,
        hasMore: hasNextPage,
        isInitialFetch: status === "pending",
        fetchingNextPage: isFetchingNextPage,
        fetchNextPage,
        isError,
        error,
    };
}

export function useSyncCampSearchValuesWithUrl() {
    const router = useRouter();
    const {
        setAdultGuestsCount,
        setCheckInDate,
        setCheckOutDate,
        setChildGuestsCount,
        setPetsCount,
    } = useSearchCampInputStore();

    const [guestsInitialValues, setGuestsInitialValues] = useState({
        adults: 0,
        children: 0,
        pets: 0,
    });
    const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
    const [checkOut, setCheckOut] = useState<Dayjs | null>(null);
    const [searchLocationText, setSearchLocationText] = useState("");

    useEffect(
        // TODO: add checks and only update if the values are different
        // otherwise remove params
        function updateStoreWithUrl() {
            if (router.isReady) {
                let searchParams = transformQueryParamsToSearchValues(
                    router.query as Record<string, string>
                );

                setCheckInDate(searchParams.checkInDate ?? null);
                setCheckOutDate(searchParams.checkOutDate ?? null);
                if (searchParams.checkInDate) {
                    setCheckIn(dayjs(searchParams.checkInDate));
                }
                if (searchParams.checkOutDate) {
                    setCheckOut(dayjs(searchParams.checkOutDate));
                }

                setAdultGuestsCount(searchParams.adultGuestsCount);
                setChildGuestsCount(searchParams.childGuestsCount);
                setPetsCount(searchParams.petsCount);
                setGuestsInitialValues({
                    adults: searchParams.adultGuestsCount,
                    children: searchParams.childGuestsCount,
                    pets: searchParams.petsCount,
                });

                setSearchLocationText(
                    (router.query.locationTextInput as string | undefined) ?? ""
                );
            }
        },
        [router.isReady]
    );

    return {
        initialFormValues: {
            guests: guestsInitialValues,
            checkIn,
            checkOut,
            searchLocationText,
        },
    };
}
