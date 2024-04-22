import { useSearchBoxCore } from "@mapbox/search-js-react";
import { debounce } from "@mui/material";
import { useMutation } from "@tanstack/react-query";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
const LIMIT = 1;

export type MapboxSearchResponse = Awaited<
    ReturnType<ReturnType<typeof useSearchBoxCore>["suggest"]>
>;

/**
 * When using this hook, make sure the `input` is wrapped with a `form` tag. This is a mandate by Mapbox.
 * This hook should be dynamically imported since `useSearchBoxCore` is not available on the server side.
 */
export function useSearchLocations() {
    const searchBox = useSearchBoxCore({ accessToken: TOKEN, limit: LIMIT });

    const mutation = useMutation({
        async mutationFn(searchInput: string) {
            if (searchInput && searchInput.length > 3) {
                const controller = new AbortController();

                try {
                    const result = await searchBox.suggest(searchInput, {
                        sessionToken: "test",
                        signal: controller.signal,
                        types: "country,region,postcode,district,place,locality,neighborhood",
                        proximity: "ip",
                    });

                    return result["suggestions"] ?? [];
                } catch (err) {
                    if (err instanceof Error && err.name === "AbortError") {
                        console.log("Fetch aborted");
                    } else {
                        console.error(err);
                    }

                    controller.abort();
                }

                return [];
            }

            return [];
        },
    });

    return {
        searchLocations: debounce(mutation.mutateAsync, 3000),
        locations: mutation.data,
        isPending: mutation.isPending,
        isError: mutation.isError,
    };
}
