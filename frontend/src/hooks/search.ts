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

    const retrieveMutation = useMutation({
        async mutationFn(
            location: MapboxSearchResponse["suggestions"][number]
        ) {
            const controller = new AbortController();

            try {
                // const result = await searchBox.retrieve(location, {
                //     sessionToken: "test",
                //     signal: controller.signal,
                // });

                // return result;

                return {
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: {
                                coordinates: [72.871827, 19.131244],
                                type: "Point",
                            },
                            properties: {
                                name: "Mumbai Suburban",
                                name_preferred: "Mumbai Suburban",
                                mapbox_id: "dXJuOm1ieHBsYzpONFpy",
                                feature_type: "district",
                                full_address:
                                    "Mumbai Suburban, Maharashtra, India",
                                place_formatted: "Maharashtra, India",
                                context: {
                                    country: {
                                        id: "dXJuOm1ieHBsYzpJbXM",
                                        name: "India",
                                        country_code: "IN",
                                        country_code_alpha_3: "IND",
                                    },
                                    region: {
                                        id: "dXJuOm1ieHBsYzpBY1Jy",
                                        name: "Maharashtra",
                                        region_code: "MH",
                                        region_code_full: "IN-MH",
                                    },
                                    district: {
                                        id: "dXJuOm1ieHBsYzpONFpy",
                                        name: "Mumbai Suburban",
                                    },
                                },
                                coordinates: {
                                    latitude: 19.131244,
                                    longitude: 72.871827,
                                },
                                bbox: [
                                    72.775662, 18.979543, 72.978723, 19.273803,
                                ],
                                language: "en",
                                maki: "marker",
                                metadata: {},
                            },
                        },
                    ],
                    attribution:
                        "© 2024 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service. (https://www.mapbox.com/about/maps/)",
                    url: "https://api.mapbox.com/search/searchbox/v1/retrieve/dXJuOm1ieHBsYzpONFpy?access_token=pk.eyJ1IjoiYWthc2hzZGFzIiwiYSI6ImNsdjh4enAxZTBsZzEya3JyYXdnOGxncnYifQ.WJyjKyYv6vOzujglgPCQbw&session_token=test",
                };
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") {
                    console.log("Fetch aborted");
                } else {
                    console.error(err);
                }

                controller.abort();
            }

            return null;
        },
    });

    const suggestMutation = useMutation({
        async mutationFn(searchInput: string) {
            if (searchInput && searchInput.length > 3) {
                const controller = new AbortController();

                try {
                    // const result = await searchBox.suggest(searchInput, {
                    //     sessionToken: "test",
                    //     signal: controller.signal,
                    //     types: "country,region,postcode,district,place,locality,neighborhood",
                    //     proximity: "ip",
                    // });

                    // return result["suggestions"] ?? [];

                    const results = {
                        suggestions: [
                            {
                                name: "Mumbai",
                                mapbox_id: "dXJuOm1ieHBsYzpBY0NvYXc",
                                feature_type: "place",
                                place_formatted: "Maharashtra, India",
                                context: {
                                    country: {
                                        id: "dXJuOm1ieHBsYzpJbXM",
                                        name: "India",
                                        country_code: "IN",
                                        country_code_alpha_3: "IND",
                                    },
                                    region: {
                                        id: "dXJuOm1ieHBsYzpBY1Jy",
                                        name: "Maharashtra",
                                        region_code: "MH",
                                        region_code_full: "IN-MH",
                                    },
                                    district: {
                                        id: "dXJuOm1ieHBsYzpONFpy",
                                        name: "Mumbai Suburban",
                                    },
                                },
                                language: "en",
                                maki: "marker",
                                metadata: {},
                            },
                            {
                                name: "Mumbai Cushion",
                                mapbox_id:
                                    "dXJuOm1ieHBvaTpiZTZjOTI5My03YTAwLTQxNTktYjQ5MS1jMjMwOWNjMWNmMzc",
                                feature_type: "poi",
                                address: "Sr No 239/4",
                                full_address:
                                    "Sr No 239/4, Mulshi, 411057, India",
                                place_formatted: "Mulshi, 411057, India",
                                context: {
                                    country: {
                                        name: "India",
                                        country_code: "IN",
                                        country_code_alpha_3: "IND",
                                    },
                                    postcode: {
                                        id: "dXJuOm1ieHBsYzpBdVVPYXc",
                                        name: "411057",
                                    },
                                    place: {
                                        id: "dXJuOm1ieHBsYzpBY0FJYXc",
                                        name: "Mulshi",
                                    },
                                    neighborhood: {
                                        id: "dXJuOm1ieHBsYzpBOFdzYXc",
                                        name: "Hinjewadi Rajiv Gandhi Infotech Park",
                                    },
                                    address: {
                                        name: "Sr No 239/4",
                                        address_number: "no 239/4",
                                        street_name: "sr",
                                    },
                                    street: {
                                        name: "sr",
                                    },
                                },
                                language: "en",
                                maki: "marker",
                                poi_category: ["services", "self storage"],
                                poi_category_ids: ["services", "storage"],
                                external_ids: {
                                    foursquare: "d363b26faf704d0dde80ae6e",
                                },
                                metadata: {},
                            },
                            {
                                name: "Mumbai Suburban",
                                mapbox_id: "dXJuOm1ieHBsYzpONFpy",
                                feature_type: "district",
                                place_formatted: "Maharashtra, India",
                                context: {
                                    country: {
                                        id: "dXJuOm1ieHBsYzpJbXM",
                                        name: "India",
                                        country_code: "IN",
                                        country_code_alpha_3: "IND",
                                    },
                                    region: {
                                        id: "dXJuOm1ieHBsYzpBY1Jy",
                                        name: "Maharashtra",
                                        region_code: "MH",
                                        region_code_full: "IN-MH",
                                    },
                                },
                                language: "en",
                                maki: "marker",
                                metadata: {},
                            },
                            {
                                name: "Mumbai Golawala",
                                mapbox_id:
                                    "dXJuOm1ieHBvaTphOWNlMTcwMC0yODdjLTQ2MTUtYTc4ZS0zYjJiN2YxZTBjYTY",
                                feature_type: "poi",
                                address: "Pimpri-Chinchwad",
                                full_address: "Pimpri-Chinchwad, 411044, India",
                                place_formatted: "411044, India",
                                context: {
                                    country: {
                                        name: "India",
                                        country_code: "IN",
                                        country_code_alpha_3: "IND",
                                    },
                                    postcode: {
                                        id: "dXJuOm1ieHBsYzpBdVF1YXc",
                                        name: "411044",
                                    },
                                    place: {
                                        id: "dXJuOm1ieHBsYzpBaG9vYXc",
                                        name: "Pimpri-Chinchwad",
                                    },
                                    neighborhood: {
                                        id: "dXJuOm1ieHBsYzpBNG9NYXc",
                                        name: "Gurudwara Colony",
                                    },
                                },
                                language: "en",
                                maki: "restaurant",
                                poi_category: [
                                    "food",
                                    "food and drink",
                                    "juice bar",
                                ],
                                poi_category_ids: [
                                    "food",
                                    "food_and_drink",
                                    "juice_bar",
                                ],
                                external_ids: {
                                    foursquare: "4fc38612e4b06f6d23f389c0",
                                },
                                metadata: {},
                            },
                            {
                                name: "Mumbais Corner",
                                mapbox_id:
                                    "dXJuOm1ieHBvaTo4YmEyZGE3NC05N2VkLTRhNDgtOWVlZS00YWY4MTcxOTIxOWE",
                                feature_type: "poi",
                                address: "Near 121 Kitchen Bar",
                                full_address:
                                    "Near 121 Kitchen Bar, Mulshi, 411057, India",
                                place_formatted: "Mulshi, 411057, India",
                                context: {
                                    country: {
                                        name: "India",
                                        country_code: "IN",
                                        country_code_alpha_3: "IND",
                                    },
                                    postcode: {
                                        id: "dXJuOm1ieHBsYzpBdVVPYXc",
                                        name: "411057",
                                    },
                                    place: {
                                        id: "dXJuOm1ieHBsYzpBY0FJYXc",
                                        name: "Mulshi",
                                    },
                                    neighborhood: {
                                        id: "dXJuOm1ieHBsYzpDY3NNYXc",
                                        name: "Shankar Kalat Nagar",
                                    },
                                    street: {
                                        name: "kitchen bar datta mandir road",
                                    },
                                },
                                language: "en",
                                maki: "restaurant",
                                poi_category: [
                                    "food",
                                    "food and drink",
                                    "indian restaurant",
                                    "restaurant",
                                ],
                                poi_category_ids: [
                                    "food",
                                    "food_and_drink",
                                    "indian_restaurant",
                                    "restaurant",
                                ],
                                external_ids: {
                                    foursquare: "c5260822711147fd5ea2459f",
                                },
                                metadata: {},
                            },
                        ],
                        attribution:
                            "© 2024 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service. (https://www.mapbox.com/about/maps/)",
                        url: "https://api.mapbox.com/search/searchbox/v1/suggest?q=mumbai&access_token=pk.eyJ1IjoiYWthc2hzZGFzIiwiYSI6ImNsdjh4enAxZTBsZzEya3JyYXdnOGxncnYifQ.WJyjKyYv6vOzujglgPCQbw&language=en&limit=5&session_token=test",
                    };

                    return results["suggestions"];
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
        searchLocations: debounce(suggestMutation.mutateAsync, 3000),
        retrieveLocation: retrieveMutation.mutateAsync,
        locations: suggestMutation.data,
        isPending: suggestMutation.isPending,
        isError: suggestMutation.isError,
    };
}
