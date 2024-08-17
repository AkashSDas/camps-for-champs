import { SearchCampsInput as SearchInput } from "@app/components/shared/search-camps-input/SearchCampsInput";
import { SwipeableDrawer, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const SearchCampsInput = dynamic(
    async function () {
        return import(
            "@app/components/shared/search-camps-input/SearchCampsInput"
        ).then((mod: any) => mod.SearchCampsInput);
    },
    { ssr: false }
) as typeof SearchInput;

type Props = {
    openSearchDrawer: boolean;
    setOpenSearchDrawer: (open: boolean) => void;
};

export function SearchCampDrawer(props: Props) {
    const router = useRouter();
    const { openSearchDrawer, setOpenSearchDrawer } = props;
    const iOS =
        typeof navigator !== "undefined" &&
        /iPad|iPhone|iPod/.test(navigator.userAgent);

    return (
        <SwipeableDrawer
            data-test="search-camps-drawer"
            anchor="top"
            open={openSearchDrawer}
            onOpen={() => setOpenSearchDrawer(true)}
            onClose={() => setOpenSearchDrawer(false)}
            disableBackdropTransition={!iOS}
            disableDiscovery={iOS}
            sx={{ overflow: "visible" }}
            PaperProps={{ sx: { overflow: "visible" } }}
        >
            <Stack px="2rem" py="2rem" gap="1rem">
                <Typography fontSize="18px" fontWeight="bold" color="grey.900">
                    Start search
                </Typography>

                <SearchCampsInput
                    fullWidth
                    rootSx={(theme) => ({
                        [theme.breakpoints.down("sm")]: { mt: "0rem" },
                    })}
                    elevation
                    onSearchClick={async (searchValues) => {
                        const searchParams = new URLSearchParams(
                            searchValues as any
                        );
                        setOpenSearchDrawer(false);
                        router.replace(`/search?${searchParams.toString()}`);
                    }}
                />
            </Stack>
        </SwipeableDrawer>
    );
}
