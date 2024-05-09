import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import Map, { Marker } from "react-map-gl";
import { LocalHotelRounded } from "@mui/icons-material";
import "mapbox-gl/dist/mapbox-gl.css";

type Props = {
    latitude: string;
    longitude: string;
    perNightCost: string;
};

export function CampSiteMap(props: Props) {
    const { latitude, longitude, perNightCost } = props;
    const [viewport, setViewport] = useState({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        zoom: 10,
    });

    return (
        <Box height="300px">
            <Map
                style={{ borderRadius: "18px" }}
                interactive={false}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
                initialViewState={viewport}
                mapStyle="mapbox://styles/mapbox/streets-v9"
            >
                <Marker
                    longitude={viewport.longitude + 0.0005}
                    latitude={viewport.latitude + 0.0005}
                    anchor="center"
                    offset={undefined}
                >
                    <Stack
                        sx={{
                            height: "38px",
                            borderRadius: "20px",
                            bgcolor: "white",
                            px: "8px",
                            border: "1px solid",
                            borderColor: "gray.200",
                            boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
                        }}
                        justifyContent="center"
                        alignItems="center"
                        direction="row"
                        gap="8px"
                    >
                        <LocalHotelRounded />
                        <Typography fontSize="13px" fontWeight="bold">
                            ₹{perNightCost}
                        </Typography>
                    </Stack>
                </Marker>
            </Map>
        </Box>
    );
}
