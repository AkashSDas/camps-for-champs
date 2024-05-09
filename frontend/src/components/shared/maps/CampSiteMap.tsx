import { Box } from "@mui/material";

type Props = {
    latitude: string;
    longitude: string;
};

export function CampSiteMap(props: Props) {
    const { latitude, longitude } = props;

    return <Box>Map</Box>;
}
