import { headingFont } from "@app/pages/_app";
import { FetchedCamp } from "@app/services/camps";
import { Stack, Typography, Button, SwipeableDrawer } from "@mui/material";
import { useState } from "react";
import { CampBookingCard } from "../camp-booking-card/CampBookingCard";
import Image from "next/image";

type MobileBottomNavigationProps = Pick<FetchedCamp, "perNightCost" | "id">;

export function MobileBottomNavigation(props: MobileBottomNavigationProps) {
    const { perNightCost } = props;
    const [open, setOpen] = useState(false);

    return (
        <>
            <Stack
                position="sticky"
                bottom={0}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                borderTop="1px solid"
                borderColor="grey.300"
                height="64px"
                px="1rem"
                width="100%"
                bgcolor="white"
                zIndex={100}
                display={{ xs: "flex", md: "none" }}
                boxShadow={{ xs: "0px -4px 8px rgba(142, 152, 168, 0.05)" }}
            >
                <Typography sx={{ color: "grey.900" }}>
                    From{" "}
                    <Typography
                        component="span"
                        fontWeight="bold"
                        fontFamily={headingFont.style.fontFamily}
                    >
                        ₹{perNightCost}
                    </Typography>{" "}
                    / night
                </Typography>

                <Button
                    variant="contained"
                    sx={{ fontFamily: headingFont.style.fontFamily }}
                    disableElevation
                    onClick={() => setOpen(true)}
                    startIcon={
                        <Image
                            src="/figmoji/tent-with-tree.png"
                            alt="Tent with Tree"
                            width={23.81}
                            height={23.42}
                            style={{ display: "inline-block" }}
                        />
                    }
                >
                    Book
                </Button>
            </Stack>

            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                sx={{ display: { xs: "block", md: "none" } }}
            >
                <CampBookingCard
                    fullscreen
                    perNightCost={perNightCost}
                    id={props.id}
                />
            </SwipeableDrawer>
        </>
    );
}
