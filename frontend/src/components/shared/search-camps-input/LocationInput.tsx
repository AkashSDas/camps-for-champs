import { useSearchLocations } from "@app/hooks/mapbox";
import {
    Autocomplete,
    Stack,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import Image from "next/image";
import { Loader } from "../loader/Loader";
import { useSearchCampInputStore } from "@app/store/search-camp-input";

export function LocationInput(): React.JSX.Element {
    const { isPending, locations, searchLocations } = useSearchLocations();
    const { location, setLocation } = useSearchCampInputStore((state) => ({
        location: state.location,
        setLocation: state.setLocation,
    }));
    const theme = useTheme();

    async function handleSearch(v: string): Promise<void> {
        if (v.length >= 3) {
            await searchLocations(v);
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
                value={location?.name ?? ""}
                onChange={(_, value): void => {
                    if (typeof value === "string") return;
                    const found = locations?.find(
                        (loc) => loc.name === value.name
                    );
                    setLocation((found ?? null) as any);
                }}
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
                    if (value.length < 3) {
                        setLocation(null);
                    }
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
                            [theme.breakpoints.down("sm")]: {
                                width: "100%",
                            },
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
