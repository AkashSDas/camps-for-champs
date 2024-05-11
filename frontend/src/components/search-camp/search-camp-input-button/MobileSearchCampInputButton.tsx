import { useSearchCampInputStore } from "@app/store/search-camp";
import { Stack, TextField, Divider } from "@mui/material";
import { SearchCampDrawer } from "./SearchCampDrawer";
import Image from "next/image";

export function MobileSearchCampInputButton() {
    const { openSearchDrawer, setOpenSearchDrawer } = useSearchCampInputStore();

    return (
        <Stack mb="1rem" gap="2rem" display={{ xs: "flex", md: "none" }}>
            <TextField
                focused
                InputProps={{
                    startAdornment: (
                        <Image
                            src="/icons/search.png"
                            alt="Search camp"
                            width={20}
                            height={20}
                            style={{ marginRight: "0.5rem" }}
                        />
                    ),
                    sx: { pointerEvents: "none" },
                }}
                variant="outlined"
                placeholder="Search camps"
                fullWidth
                sx={{ cursor: "pointer" }}
                onClick={() => setOpenSearchDrawer(true)}
            />

            <Divider sx={{ borderColor: "grey.200" }} />

            <SearchCampDrawer
                openSearchDrawer={openSearchDrawer}
                setOpenSearchDrawer={setOpenSearchDrawer}
            />
        </Stack>
    );
}
