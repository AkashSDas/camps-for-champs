import { TextField } from "@mui/material";
import Image from "next/image";

export function GuestsInput(): React.JSX.Element {
    return (
        <TextField
            label="GuestsInput"
            placeholder="Add guests"
            sx={{ flexGrow: 1, input: { cursor: "pointer" } }}
            disabled
            InputProps={{
                startAdornment: (
                    <Image
                        src="/icons/user.png"
                        alt="Add guests"
                        height={24}
                        width={24}
                        style={{ marginRight: "0.5rem" }}
                    />
                ),
            }}
        />
    );
}
