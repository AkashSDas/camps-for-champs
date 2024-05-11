import { useSearchCampInputStore } from "@app/store/search-camp";
import {
    Button,
    Divider,
    Stack,
    SwipeableDrawer,
    Typography,
} from "@mui/material";
import Image from "next/image";
import { SearchCampsInput as SearchInput } from "@app/components/shared/search-camps-input/SearchCampsInput";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const SearchCampsInput = dynamic(
    async function () {
        return import(
            "@app/components/shared/search-camps-input/SearchCampsInput"
        ).then((mod: any) => mod.SearchCampsInput);
    },
    { ssr: false }
) as typeof SearchInput;

export function SearchCampInputButton() {
    const { openSearchDrawer, setOpenSearchDrawer } = useSearchCampInputStore();
    const iOS =
        typeof navigator !== "undefined" &&
        /iPad|iPhone|iPod/.test(navigator.userAgent);
    const router = useRouter();

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

            <SwipeableDrawer
                anchor="top"
                open={openSearchDrawer}
                onOpen={() => setOpenSearchDrawer(true)}
                onClose={() => setOpenSearchDrawer(false)}
                disableBackdropTransition={!iOS}
                disableDiscovery={iOS}
            >
                <Stack px="2rem" py="2rem" gap="1rem">
                    <Typography
                        fontSize="18px"
                        fontWeight="bold"
                        color="grey.900"
                    >
                        Start search
                    </Typography>

                    <SearchCampsInput
                        fullWidth
                        rootSx={(theme) => ({
                            [theme.breakpoints.down("sm")]: { mt: "4rem" },
                        })}
                        elevation
                        onSearchClick={async (searchValues) => {
                            const searchParams = new URLSearchParams(
                                searchValues as any
                            );
                            setOpenSearchDrawer(false);
                            router.replace(
                                `/search?${searchParams.toString()}`
                            );
                        }}
                    />
                </Stack>
            </SwipeableDrawer>
        </>
    );
}
