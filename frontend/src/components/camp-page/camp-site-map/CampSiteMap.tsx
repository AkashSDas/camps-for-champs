import {
    Box,
    Button,
    IconButton,
    Stack,
    Typography,
    debounce,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Map, { MapRef, Marker, ViewState } from "react-map-gl";
import { LocalHotelRounded } from "@mui/icons-material";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter } from "next/router";
import Image from "next/image";

type Props = {
    camps: {
        latitude: string;
        longitude: string;
        perNightCost: string;
    }[];
    fullMap: boolean;
    setFullMap: (value: boolean) => void;
};

export function CampSiteMap(props: Props) {
    const { camps } = props;
    const [viewport, setViewport] = useState<Partial<ViewState>>({
        latitude: parseFloat(camps[0]?.latitude ?? "0"),
        longitude: parseFloat(camps[0]?.longitude ?? "0"),
        zoom: 10,
    });
    const map = useRef<MapRef>(null);
    const router = useRouter();

    useEffect(() => {
        const bounds = map.current?.getBounds();
        if (bounds) {
            const bbox = [
                bounds.getWest(), // Left (west)
                bounds.getSouth(), // Bottom (south)
                bounds.getEast(), // Right (east)
                bounds.getNorth(), // Top (north)
            ];

            debounce(handleUpdatingParams, 1000)(bbox);
        }
    }, [viewport]);

    function handleUpdatingParams(bbox: number[]) {
        router.replace(router.asPath, {
            query: {
                ...router.query,
                locationTextInput: undefined,
                location: bbox.join(","),
            },
        });
    }

    return (
        <Box
            key={props.fullMap ? "full-map" : "half-map"}
            height="calc(100vh - 70px)"
            display={{ xs: "none", md: "block" }}
            position="sticky"
            width={props.fullMap ? "100%" : "60%"}
            top="70px"
        >
            {props.fullMap ? (
                <Button
                    key={props.fullMap ? "full-map" : "half-map"}
                    sx={{
                        position: "absolute",
                        top: "2rem",
                        left: "2rem",
                        zIndex: 1000,
                        bgcolor: "white",
                        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
                    }}
                >
                    Show List
                </Button>
            ) : (
                <IconButton
                    key={props.fullMap ? "full-map" : "half-map"}
                    sx={{
                        position: "absolute",
                        top: "2rem",
                        left: "2rem",
                        zIndex: 1000,
                        bgcolor: "white",
                        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
                    }}
                    onClick={() => props.setFullMap(true)}
                >
                    <Image
                        src="/icons/back-arrow.png"
                        alt="Full screen map"
                        width={24}
                        height={24}
                    />
                </IconButton>
            )}

            <Map
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
                initialViewState={viewport}
                onMove={(evt) => setViewport(evt.viewState)}
                ref={map}
                mapStyle="mapbox://styles/mapbox/streets-v9"
            >
                {camps.map((camp, index) => (
                    <Marker
                        key={index}
                        longitude={parseFloat(camp.longitude)}
                        latitude={parseFloat(camp.latitude)}
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
                                ₹{camp.perNightCost}
                            </Typography>
                        </Stack>
                    </Marker>
                ))}
            </Map>
        </Box>
    );
}
