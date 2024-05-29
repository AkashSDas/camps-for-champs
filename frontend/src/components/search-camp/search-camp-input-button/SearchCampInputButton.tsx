import { useSearchCampInputStore } from "@app/store/search-camp";
import { Button, Divider, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { SearchCampDrawer } from "./SearchCampDrawer";
import { useRouter } from "next/router";

export function SearchCampInputButton() {
    const { openSearchDrawer, setOpenSearchDrawer } = useSearchCampInputStore();
    const router = useRouter();

    if (router.pathname === "/") {
        return null;
    }

    return (
        <>
            <Stack
                direction="row"
                gap="0.5rem"
                display={{ xs: "none", md: "flex" }}
                sx={{ cursor: "pointer" }}
                onClick={() => setOpenSearchDrawer(true)}
            >
                <Stack
                    direction="row"
                    border="1.5px solid"
                    borderColor="grey.300"
                    borderRadius="18px"
                    height="50px"
                    divider={
                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                borderColor: "grey.200",
                                height: "70%",
                                my: "auto",
                            }}
                        />
                    }
                    justifyContent="center"
                    alignItems="center"
                    px="12px"
                    gap="8px"
                    color="grey.600"
                    fontWeight="semibold"
                    sx={{ pointerEvents: "none" }}
                >
                    <Typography fontSize="14px">Location</Typography>
                    <Typography fontSize="14px">Date</Typography>
                    <Typography fontSize="14px">Guests</Typography>
                </Stack>

                <Button
                    variant="contained"
                    disableElevation
                    sx={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "16px",
                        pointerEvents: "none",
                    }}
                >
                    <Image
                        src="/icons/search-light.png"
                        width={20}
                        height={20}
                        alt="Search"
                    />
                </Button>
            </Stack>

            <SearchCampDrawer
                openSearchDrawer={openSearchDrawer}
                setOpenSearchDrawer={setOpenSearchDrawer}
            />
        </>
    );
}
