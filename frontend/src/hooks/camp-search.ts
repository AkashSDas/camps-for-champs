import { searchCamps } from "@app/services/camps";
import { type SearchCampInputStore } from "@app/store/search-camp-input";
import { type MapboxBBox } from "./mapbox";
import { useQuery } from "@tanstack/react-query";

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
    console.log("HERE");
    const { data, isLoading, isError, error } = useQuery({
        queryKey: [
            "searchCamps",
            searchValues.adultGuestsCount,
            searchValues.childGuestsCount,
            searchValues.petsCount,
            searchValues.location,
            searchValues.checkInDate,
            searchValues.checkOutDate,
        ],
        queryFn: () => searchCamps(searchValues, limit, page),
        staleTime: 1000 * 60 * 5,
        enabled: typeof window !== "undefined",
    });

    return {
        camps: data?.camps ?? [],
        count: data?.count ?? 0,
        next: data?.next ?? null,
        previous: data?.previous ?? null,
        isLoading,
        isError,
        error,
    };
}
