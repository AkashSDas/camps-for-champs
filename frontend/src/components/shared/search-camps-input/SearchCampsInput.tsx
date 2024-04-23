import { Button, Stack } from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";
import { DatesInput } from "./DatesInput";
import { GuestsInput } from "./GuestsInput";
import { useSearchCampInputStore } from "@app/store/search-camp-input";

const LocationInput = dynamic(
    async function () {
        return import("./LocationInput").then((mod: any) => mod.LocationInput);
    },
    { ssr: false }
);

export function SearchCampsInput(): React.JSX.Element {
    const searchInfo = useSearchCampInputStore((state) => ({
        adultsCount: state.adultGuestsCount,
        childrenCount: state.childGuestsCount,
        petsCount: state.petsCount,
        location: state.location,
        checkInDate: state.checkInDate,
        checkOutDate: state.checkOutDate,
    }));

    function handleSearchClick(): void {
        console.log(searchInfo);
    }

    return (
        <Stack
            component="form"
            sx={(theme) => ({
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                p: "2rem",
                borderRadius: "20px",
                maxWidth: "1312px",
                width: "100%",
                bgcolor: "#F4F7F3",
                gap: "1rem",
                [theme.breakpoints.down("sm")]: {
                    flexDirection: "column",
                    gap: "1.5rem",
                    p: "1rem",
                },
            })}
        >
            <LocationInput />
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
