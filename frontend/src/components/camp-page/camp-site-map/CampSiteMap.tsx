import {
    Box,
    Button,
    ClickAwayListener,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import {
    ComponentProps,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import Map, { MapRef, Marker, Popup, ViewState } from "react-map-gl";
import { LocalHotelRounded } from "@mui/icons-material";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter } from "next/router";
import Image from "next/image";
import _debounce from "lodash/debounce";
import { Loader } from "@app/components/shared/loader/Loader";
import { FetchedCamp } from "@app/services/camps";
import { CampCardMapMarker } from "./CampCardMapMarker";

type Props = {
    camps: Pick<
        FetchedCamp,
        | "id"
        | "latitude"
        | "longitude"
        | "about"
        | "name"
        | "images"
        | "overallRating"
        | "totalReviews"
        | "perNightCost"
        | "tags"
    >[];
    isPending: boolean;
    fullMap: boolean;
    setFullMap: (value: boolean) => void;
};

export function CampSiteMap(props: Props) {
    const { camps, isPending } = props;
    const [viewport, setViewport] = useState<Partial<ViewState>>({
        latitude: parseFloat(camps[0]?.latitude ?? "0"),
        longitude: parseFloat(camps[0]?.longitude ?? "0"),
        zoom: 10,
    });
    const [showCampCard, setShowCampCard] = useState<
        | null
        | (ComponentProps<typeof CampCardMapMarker>["camp"] &
              Pick<Props["camps"][number], "latitude" | "longitude">)
    >(null);
    const map = useRef<MapRef>(null);
    const router = useRouter();
    const handleUpdatingParams = useCallback(
        async function (bbox: number[]) {
            await router.replace(router.asPath, {
                query: {
                    ...router.query,
                    locationTextInput: undefined,
                    location: bbox.join(","),
                },
            });
        },
        [router]
    );
    const handleUpdatingParamsDebounce = useCallback(
        _debounce(handleUpdatingParams, 300, {
            leading: true,
            trailing: false,
        }),
        []
    );

    useEffect(() => {
        const bounds = map.current?.getBounds();
        if (bounds) {
            const bbox = [
                bounds.getWest(), // Left (west)
                bounds.getSouth(), // Bottom (south)
                bounds.getEast(), // Right (east)
                bounds.getNorth(), // Top (north)
            ];

            handleUpdatingParamsDebounce(bbox);
        }
    }, [viewport]);

    console.log({ showCampCard });
    return (
        <Box
            height="calc(100vh - 70px)"
            display={{ xs: "none", md: "block" }}
            position="sticky"
            width={props.fullMap ? "100%" : "60%"}
            top="70px"
        >
            {props.fullMap ? (
                <Button
                    sx={{
                        position: "absolute",
                        top: "2rem",
                        left: "2rem",
                        zIndex: 1000,
                        bgcolor: "white",
                        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
                        "&:hover": {
                            bgcolor: "white",
                        },
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        props.setFullMap(false);
                    }}
                >
                    Show List
                </Button>
            ) : (
                <IconButton
                    sx={{
                        position: "absolute",
                        top: "2rem",
                        left: "2rem",
                        zIndex: 1000,
                        bgcolor: "white",
                        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
                        "&:hover": {
                            bgcolor: "white",
                        },
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        props.setFullMap(true);
                    }}
                >
                    <Image
                        src="/icons/back-arrow.png"
                        alt="Full screen map"
                        width={24}
                        height={24}
                    />
                </IconButton>
            )}

            {isPending ? (
                <Stack
                    sx={{
                        height: "44px",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "12px",
                        paddingInline: "24px",
                        position: "absolute",
                        top: "2rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1000,
                        bgcolor: "white",
                        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
                    }}
                >
                    <Loader variant="neutral" />
                </Stack>
            ) : null}

            <Map
                onLoad={() => {
                    map.current?.flyTo({
                        center: [
                            parseFloat(camps[0]?.longitude ?? "0"),
                            parseFloat(camps[0]?.latitude ?? "0"),
                        ],
                        zoom: viewport.zoom,
                    });
                }}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
                initialViewState={viewport}
                onMoveEnd={(evt) => setViewport(evt.viewState)}
                ref={map}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                key={props.fullMap ? "full-map" : "half-map"}
            >
                {showCampCard !== null ? (
                    <ClickAwayListener
                        onClickAway={() => setShowCampCard(null)}
                    >
                        <Popup
                            onClose={(e) => {
                                console.log({ e });
                                setShowCampCard(null);
                            }}
                            closeOnClick={false}
                            longitude={parseFloat(showCampCard.longitude)}
                            latitude={parseFloat(showCampCard.latitude)}
                            anchor="bottom"
                            closeButton={false}
                        >
                            <Box width="280px">
                                <CampCardMapMarker camp={showCampCard} />
                            </Box>
                        </Popup>
                    </ClickAwayListener>
                ) : null}

                {camps.map((camp, index) => (
                    <Marker
                        key={camp.id}
                        longitude={parseFloat(camp.longitude)}
                        latitude={parseFloat(camp.latitude)}
                        anchor="center"
                        offset={undefined}
                        style={{ zIndex: 1 }}
                    >
                        <Stack
                            onClick={() => {
                                setShowCampCard({
                                    ...camp,
                                    latitude: camp.latitude,
                                    longitude: camp.longitude,
                                });
                            }}
                            sx={{
                                height: "38px",
                                borderRadius: "20px",
                                bgcolor: "white",
                                px: "8px",
                                border: "1px solid",
                                borderColor: "gray.200",
                                boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
                                cursor: "pointer",
                                transition: "transform 0.3s ease-in-out",
                                "&:hover": {
                                    transform: "scale(1.1)",
                                },
                                "&:active": {
                                    transform: "scale(1.05)",
                                },
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
