import { TextField } from "@mui/material";
import Image from "next/image";

export function DatesInput(): React.JSX.Element {
    return (
        <TextField
            label="Dates"
            placeholder="Add dates"
            sx={{ flexGrow: 1, input: { cursor: "pointer" } }}
            disabled
            InputProps={{
                startAdornment: (
                    <Image
                        src="/icons/calendar.png"
                        alt="Check in and out dates"
                        height={24}
                        width={24}
                        style={{ marginRight: "0.5rem" }}
                    />
                ),
            }}
        />
    );
}
