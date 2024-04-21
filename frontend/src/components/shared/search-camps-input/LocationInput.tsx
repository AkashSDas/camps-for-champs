import { useSearchLocations } from "@app/hooks/search";
import {
    Autocomplete,
    Stack,
    TextField,
    Typography,
    autocompleteClasses,
} from "@mui/material";
import Image from "next/image";

const options = [
    { title: "Mumbai" },
    { title: "Delhi" },
    { title: "Bangalore" },
    { title: "Hyderabad" },
    { title: "Kolkata" },
    { title: "Chennai" },
    { title: "Ahmedabad" },
    { title: "Pune" },
    { title: "Surat" },
    { title: "Jaipur" },
    { title: "Kanpur" },
    { title: "Lucknow" },
    { title: "Nagpur" },
    { title: "Patna" },
    { title: "Indore" },
    { title: "Thane" },
    { title: "Bhopal" },
    { title: "Visakhapatnam" },
    { title: "Vadodara" },
    { title: "Firozabad" },
];

export function LocationInput(): React.JSX.Element {
    // const {
    //     isPending,
    //     isError,
    //     locations,
    //     searchLocations,
    //     searchInput,
    //     setSearchInput,
    // } = useSearchLocations();

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
                options={options}
                ListboxProps={{
                    sx: {
                        padding: "0.5rem",
                        boxShadow: "none",
                    },
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
                    console.log("OOOPT", option);
                    if (typeof option === "string") return option;
                    return option.title;
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
                                    src="/icons/location.png"
                                    alt="Location"
                                    height={18}
                                    width={18}
                                />

                                <Typography variant="body1">
                                    {option.title}
                                </Typography>
                            </Stack>
                        </Stack>
                    );
                }}
            />
        </>
    );
}
