import { searchCamps } from "@app/services/camps";
import { type SearchCampInputStore } from "@app/store/search-camp-input";
import { type MapboxBBox } from "./mapbox";
import {
    keepPreviousData,
    useInfiniteQuery,
    useQuery,
} from "@tanstack/react-query";

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
    // Pagination example
    // const { data, isLoading, isError, error, isFetching, isPlaceholderData } =
    //     useQuery({
    //         queryKey: [
    //             "searchCamps",
    //             searchValues.adultGuestsCount,
    //             searchValues.childGuestsCount,
    //             searchValues.petsCount,
    //             searchValues.location,
    //             searchValues.checkInDate,
    //             searchValues.checkOutDate,
    //             page,
    //         ],
    //         queryFn: () => searchCamps(searchValues, limit, page),
    //         placeholderData: keepPreviousData,
    //         staleTime: 1000 * 60 * 5,
    //     });

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
