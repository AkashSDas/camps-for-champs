import { TextField } from "@mui/material";
import Image from "next/image";

export function LocationInput(): React.JSX.Element {
    return (
        <TextField
            label="Location"
            placeholder="Search"
            sx={{ flexGrow: 1 }}
            // value={locationInput}
            // onChange={(e) => {
            //     setLocationInput(e.target.value);
            // }}
            InputProps={{
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
}
