import { Search } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";
import { DatesInput } from "./DatesInput";
import { GuestsInput } from "./GuestsInput";

const LocationInput = dynamic(
    async function () {
        return import("./LocationInput").then((mod: any) => mod.LocationInput);
    },
    { ssr: false }
);

export function SearchCampsInput(): React.JSX.Element {
    return (
        <Stack
            component="form"
            sx={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                p: "2rem",
                mx: "auto",
                borderRadius: "20px",
                maxWidth: "1312px",
                width: "100%",
                bgcolor: "#F4F7F3",
                gap: "1rem",
            }}
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
                sx={{
                    height: "60px",
                    borderRadius: "14px",
                    px: "2rem",
                    width: "fit-content",
                }}
                disableElevation
            >
                Search
            </Button>
        </Stack>
    );
}
