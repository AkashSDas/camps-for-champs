import { MapboxSearchResponse, useSearchLocations } from "@app/hooks/search";
import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { Loader } from "../loader/Loader";

export function LocationInput(): React.JSX.Element {
    const { isPending, locations, searchLocations } = useSearchLocations();

    async function handleSearch(v: string): Promise<void> {
        if (v.length >= 3) {
            const result = await searchLocations(v);
            console.log({ result });
        }
    }

    return (
        <>
            <Autocomplete
                id="location-input"
                disablePortal
                sx={{ flexGrow: 1 }}
                freeSolo
                selectOnFocus
                disableClearable
                fullWidth
                options={locations ?? []}
                loading={isPending}
                loadingText={
                    <Stack py="1rem">
                        <Loader />
                    </Stack>
                }
                ListboxProps={{
                    sx: {
                        padding: "0.5rem",
                        boxShadow: "none",
                    },
                }}
                onInputChange={(e, value) => {
                    e.preventDefault();
                    handleSearch(value);
                }}
                componentsProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            mt: "10px",
                            borderRadius: "12px",
                            border: "1px solid",
                            borderColor: "grey.400",
                            width: "400px",
                            boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.15)",
                        },
                    },
                }}
                renderInput={(params) => {
                    return (
                        <TextField
                            {...params}
                            label="Location"
                            placeholder="Search"
                            // value={searchInput}
                            // onChange={(e) => setSearchInput(e.target.value)}
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <Image
                                        src="/icons/location.png"
                                        alt="Location"
                                        height={24}
                                        width={24}
                                        style={{ marginRight: "0.5rem" }}
                                    />
                                ),
                            }}
                        />
                    );
                }}
                getOptionLabel={(option) => {
                    if (typeof option === "string") return option;
                    return option.name;
                }}
                renderOption={(props, option) => {
                    return (
                        <Stack
                            component="li"
                            {...props}
                            sx={{
                                height: "48px",
                                borderBottom: "1px solid",
                                borderColor: "grey.200",
                                "&:hover": {
                                    bgcolor: "grey.400",
                                },
                            }}
                        >
                            <Stack
                                direction="row"
                                gap="0.5rem"
                                height="100%"
                                alignItems="center"
                                sx={{ width: "100%" }}
                            >
                                <Image
                                    src="/icons/pin-2.png"
                                    alt="Location"
                                    height={18}
                                    width={18}
                                />

                                <Typography variant="body1">
                                    {option.name}
                                </Typography>
                            </Stack>
                        </Stack>
                    );
                }}
            />
        </>
    );
}

// result:
// const results = {
//     suggestions: [
//         {
//             name: "Mumbai",
//             mapbox_id: "dXJuOm1ieHBsYzpBY0NvYXc",
//             feature_type: "place",
//             place_formatted: "Maharashtra, India",
//             context: {
//                 country: {
//                     id: "dXJuOm1ieHBsYzpJbXM",
//                     name: "India",
//                     country_code: "IN",
//                     country_code_alpha_3: "IND",
//                 },
//                 region: {
//                     id: "dXJuOm1ieHBsYzpBY1Jy",
//                     name: "Maharashtra",
//                     region_code: "MH",
//                     region_code_full: "IN-MH",
//                 },
//                 district: {
//                     id: "dXJuOm1ieHBsYzpONFpy",
//                     name: "Mumbai Suburban",
//                 },
//             },
//             language: "en",
//             maki: "marker",
//             metadata: {},
//         },
//         {
//             name: "Mumbai Cushion",
//             mapbox_id:
//                 "dXJuOm1ieHBvaTpiZTZjOTI5My03YTAwLTQxNTktYjQ5MS1jMjMwOWNjMWNmMzc",
//             feature_type: "poi",
//             address: "Sr No 239/4",
//             full_address: "Sr No 239/4, Mulshi, 411057, India",
//             place_formatted: "Mulshi, 411057, India",
//             context: {
//                 country: {
//                     name: "India",
//                     country_code: "IN",
//                     country_code_alpha_3: "IND",
//                 },
//                 postcode: {
//                     id: "dXJuOm1ieHBsYzpBdVVPYXc",
//                     name: "411057",
//                 },
//                 place: {
//                     id: "dXJuOm1ieHBsYzpBY0FJYXc",
//                     name: "Mulshi",
//                 },
//                 neighborhood: {
//                     id: "dXJuOm1ieHBsYzpBOFdzYXc",
//                     name: "Hinjewadi Rajiv Gandhi Infotech Park",
//                 },
//                 address: {
//                     name: "Sr No 239/4",
//                     address_number: "no 239/4",
//                     street_name: "sr",
//                 },
//                 street: {
//                     name: "sr",
//                 },
//             },
//             language: "en",
//             maki: "marker",
//             poi_category: ["services", "self storage"],
//             poi_category_ids: ["services", "storage"],
//             external_ids: {
//                 foursquare: "d363b26faf704d0dde80ae6e",
//             },
//             metadata: {},
//         },
//         {
//             name: "Mumbai Suburban",
//             mapbox_id: "dXJuOm1ieHBsYzpONFpy",
//             feature_type: "district",
//             place_formatted: "Maharashtra, India",
//             context: {
//                 country: {
//                     id: "dXJuOm1ieHBsYzpJbXM",
//                     name: "India",
//                     country_code: "IN",
//                     country_code_alpha_3: "IND",
//                 },
//                 region: {
//                     id: "dXJuOm1ieHBsYzpBY1Jy",
//                     name: "Maharashtra",
//                     region_code: "MH",
//                     region_code_full: "IN-MH",
//                 },
//             },
//             language: "en",
//             maki: "marker",
//             metadata: {},
//         },
//         {
//             name: "Mumbai Golawala",
//             mapbox_id:
//                 "dXJuOm1ieHBvaTphOWNlMTcwMC0yODdjLTQ2MTUtYTc4ZS0zYjJiN2YxZTBjYTY",
//             feature_type: "poi",
//             address: "Pimpri-Chinchwad",
//             full_address: "Pimpri-Chinchwad, 411044, India",
//             place_formatted: "411044, India",
//             context: {
//                 country: {
//                     name: "India",
//                     country_code: "IN",
//                     country_code_alpha_3: "IND",
//                 },
//                 postcode: {
//                     id: "dXJuOm1ieHBsYzpBdVF1YXc",
//                     name: "411044",
//                 },
//                 place: {
//                     id: "dXJuOm1ieHBsYzpBaG9vYXc",
//                     name: "Pimpri-Chinchwad",
//                 },
//                 neighborhood: {
//                     id: "dXJuOm1ieHBsYzpBNG9NYXc",
//                     name: "Gurudwara Colony",
//                 },
//             },
//             language: "en",
//             maki: "restaurant",
//             poi_category: ["food", "food and drink", "juice bar"],
//             poi_category_ids: ["food", "food_and_drink", "juice_bar"],
//             external_ids: {
//                 foursquare: "4fc38612e4b06f6d23f389c0",
//             },
//             metadata: {},
//         },
//         {
//             name: "Mumbais Corner",
//             mapbox_id:
//                 "dXJuOm1ieHBvaTo4YmEyZGE3NC05N2VkLTRhNDgtOWVlZS00YWY4MTcxOTIxOWE",
//             feature_type: "poi",
//             address: "Near 121 Kitchen Bar",
//             full_address: "Near 121 Kitchen Bar, Mulshi, 411057, India",
//             place_formatted: "Mulshi, 411057, India",
//             context: {
//                 country: {
//                     name: "India",
//                     country_code: "IN",
//                     country_code_alpha_3: "IND",
//                 },
//                 postcode: {
//                     id: "dXJuOm1ieHBsYzpBdVVPYXc",
//                     name: "411057",
//                 },
//                 place: {
//                     id: "dXJuOm1ieHBsYzpBY0FJYXc",
//                     name: "Mulshi",
//                 },
//                 neighborhood: {
//                     id: "dXJuOm1ieHBsYzpDY3NNYXc",
//                     name: "Shankar Kalat Nagar",
//                 },
//                 street: {
//                     name: "kitchen bar datta mandir road",
//                 },
//             },
//             language: "en",
//             maki: "restaurant",
//             poi_category: [
//                 "food",
//                 "food and drink",
//                 "indian restaurant",
//                 "restaurant",
//             ],
//             poi_category_ids: [
//                 "food",
//                 "food_and_drink",
//                 "indian_restaurant",
//                 "restaurant",
//             ],
//             external_ids: {
//                 foursquare: "c5260822711147fd5ea2459f",
//             },
//             metadata: {},
//         },
//     ],
//     attribution:
//         "© 2024 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service. (https://www.mapbox.com/about/maps/)",
//     url: "https://api.mapbox.com/search/searchbox/v1/suggest?q=mumbai&access_token=pk.eyJ1IjoiYWthc2hzZGFzIiwiYSI6ImNsdjh4enAxZTBsZzEya3JyYXdnOGxncnYifQ.WJyjKyYv6vOzujglgPCQbw&language=en&limit=5&session_token=test",
// };
