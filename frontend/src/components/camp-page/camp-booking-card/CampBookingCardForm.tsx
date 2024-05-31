import { bodyFont } from "@app/pages/_app";
import { FetchedCamp } from "@app/services/camps";
import { useCampBookingInputStore } from "@app/store/camp-booking-input";
import { Stack, Button, Typography, Divider } from "@mui/material";
import { useMemo } from "react";
import { DatesInput } from "./DatesInput";
import { GuestsInput } from "./GuestsInput";
import Image from "next/image";
import Link from "next/link";

type CampBookingCardFormProps = Pick<FetchedCamp, "perNightCost" | "id">;

export function CampBookingCardForm(props: CampBookingCardFormProps) {
    const { perNightCost } = props;
    const inputs = useCampBookingInputStore((state) => ({
        checkInDate: state.checkInDate,
        checkOutDate: state.checkOutDate,
        adultGuestsCount: state.adultGuestsCount,
        childGuestsCount: state.childGuestsCount,
        petsCount: state.petsCount,
    }));

    const numOfDays = useMemo(
        function () {
            if (!inputs.checkInDate || !inputs.checkOutDate) {
                return 1;
            }

            const diffTime =
                inputs.checkOutDate.getTime() - inputs.checkInDate.getTime();
            return diffTime / (1000 * 60 * 60 * 24);
        },
        [inputs.checkInDate, inputs.checkOutDate]
    );

    const costOfGuestsPerNight = useMemo(
        function () {
            const adultCount = inputs.adultGuestsCount;
            const childCount = inputs.childGuestsCount / 2;
            const petCount = inputs.petsCount / 2;
            const occupancyToBeConsidered = Math.ceil(
                (adultCount + childCount + petCount) / 4
            );
            const cost =
                (occupancyToBeConsidered === 0 ? 1 : occupancyToBeConsidered) *
                parseFloat(perNightCost);
            return cost;
        },
        [
            inputs.adultGuestsCount,
            inputs.childGuestsCount,
            inputs.petsCount,
            perNightCost,
        ]
    );

    const totalCost = useMemo(
        function () {
            return numOfDays * costOfGuestsPerNight;
        },
        [numOfDays, costOfGuestsPerNight]
    );

    return (
        <Stack component="form" gap="1rem" my="1rem">
            <DatesInput />
            <GuestsInput />

            <Button
                variant="contained"
                disableElevation
                LinkComponent={Link}
                href={`/camps/${props.id}/checkout`}
                target="_blank"
                sx={{ height: "56px" }}
                startIcon={
                    <Image
                        src="/figmoji/tent-with-tree.png"
                        alt="Book camp"
                        width={20}
                        height={20}
                    />
                }
            >
                Book
            </Button>

            <Stack gap="0.5rem" mt="1rem">
                <Stack direction="row" justifyContent="space-between">
                    <Typography>
                        <Typography component="span">
                            ₹{costOfGuestsPerNight}{" "}
                        </Typography>
                        <Typography component="span">x </Typography>
                        <Typography component="span">{numOfDays}</Typography>
                    </Typography>

                    <Typography>₹{totalCost}</Typography>
                </Stack>

                <Divider sx={{ borderColor: "grey.200", my: "8px" }} />

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    color="grey.900"
                >
                    <Typography fontWeight="bold">Total</Typography>
                    <Typography fontWeight="bold">₹{totalCost}</Typography>
                </Stack>
            </Stack>
        </Stack>
    );
}
