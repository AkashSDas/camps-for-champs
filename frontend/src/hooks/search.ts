import { useSearchBoxCore } from "@mapbox/search-js-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
const LIMIT = 5;

/**
 * When using this hook, make sure the `input` is wrapped with a `form` tag. This is a mandate by Mapbox.
 * This hook should be dynamically imported since `useSearchBoxCore` is not available on the server side.
 */
export function useSearchLocations() {
    const [searchInput, setSearchInput] = useState<string>("");
    const { suggest } = useSearchBoxCore({ accessToken: TOKEN, limit: LIMIT });

    const mutation = useMutation({
        async mutationFn() {
            if (searchInput && searchInput.length > 3) {
                const controller = new AbortController();

                try {
                    const result = await suggest(searchInput, {
                        sessionToken: "test",
                        signal: controller.signal,
                    });

                    console.log({ result });
                } catch (err) {
                    if (err instanceof Error && err.name === "AbortError") {
                        console.log("Fetch aborted");
                    } else {
                        throw err;
                    }

                    controller.abort();
                }
            }
        },
    });

    return {
        searchInput,
        setSearchInput,
        searchLocations: mutation.mutateAsync,
        locations: mutation.data,
        isPending: mutation.isPending,
        isError: mutation.isError,
    };
}
