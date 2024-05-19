import { Button, Stack, SxProps, Theme } from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";
import { DatesInput } from "./DatesInput";
import { GuestsInput } from "./GuestsInput";
import { LocationInput as LocInput } from "./LocationInput";
import { useSearchCampInputStore } from "@app/store/search-camp-input";
import { type MapboxBBox, useSearchLocations } from "@app/hooks/mapbox";
import { type SearchCampsQueryValues } from "@app/hooks/camp-search";
import { useState } from "react";

const LocationInput = dynamic(
    async function () {
        return import("./LocationInput").then((mod: any) => mod.LocationInput);
    },
    { ssr: false }
) as typeof LocInput;

type Props = {
    rootSx?: SxProps<Theme> | undefined;
    elevation?: boolean;
    onSearchClick: (
        values: SearchCampsQueryValues & { locationTextInput?: string }
    ) => Promise<void>;
    fullWidth?: boolean;
};

export function SearchCampsInput(props: Props): React.JSX.Element {
    const { retrieveLocation } = useSearchLocations();
    const searchInfo = useSearchCampInputStore((state) => ({
        adultGuestsCount: state.adultGuestsCount,
        childGuestsCount: state.childGuestsCount,
        petsCount: state.petsCount,
        location: state.location,
        checkInDate: state.checkInDate,
        checkOutDate: state.checkOutDate,
    }));
    const [locationTextInput, setLocationTextInput] = useState("");

    async function handleSearchClick(): Promise<void> {
        let location: undefined | MapboxBBox = undefined;

        if (searchInfo.location) {
            const result = await retrieveLocation(searchInfo.location);
            if (
                result &&
                Array.isArray(result.features) &&
                result.features.length > 0 &&
                result.features[0].properties?.bbox
            ) {
                location = result.features[0].properties.bbox as MapboxBBox;
            } else {
                alert("Invalid location");
                return;
            }
        }

        console.log({ searchInfo, location, locationTextInput });

        props.onSearchClick({
            adultGuestsCount: searchInfo.adultGuestsCount,
            childGuestsCount: searchInfo.childGuestsCount,
            petsCount: searchInfo.petsCount,
            location: location,
            checkInDate: searchInfo.checkInDate,
            checkOutDate: searchInfo.checkOutDate,
            locationTextInput: locationTextInput,
        });
    }

    return (
        <Stack
            component="form"
            sx={[
                (theme) => ({
                    // boxShadow: props.elevation
                    //     ? `0px 4px 12px rgba(101, 110, 96, 0.2)`
                    //     : "none",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    p: "2rem",
                    borderRadius: props.fullWidth ? "0px" : "20px",
                    maxWidth: props.fullWidth ? "100%" : "1312px",
                    width: "100%",
                    bgcolor: "#F4F7F3",
                    gap: "1rem",
                    [theme.breakpoints.down("sm")]: {
                        flexDirection: "column",
                        gap: "1.5rem",
                        px: "1rem",
                        py: "2rem",
                    },
                }),
                props.rootSx as any,
            ]}
        >
            <LocationInput setLocationTextInput={setLocationTextInput} />
            <DatesInput />
            <GuestsInput />

            {/* Search button */}
            <Button
                startIcon={
                    <Image
                        src="/icons/search-light.png"
                        alt="Search"
                        height={24}
                        width={24}
                    />
                }
                variant="contained"
                sx={(theme) => ({
                    height: "60px",
                    borderRadius: "14px",
                    px: "2rem",
                    width: "360px",
                    [theme.breakpoints.down("sm")]: {
                        width: "100%",
                    },
                })}
                disableElevation
                onClick={handleSearchClick}
            >
                Search
            </Button>
        </Stack>
    );
}
