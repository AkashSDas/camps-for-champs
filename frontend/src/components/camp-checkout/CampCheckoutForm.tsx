import { type FetchedCamp } from "@app/services/camps";
import { useCampCheckoutStore } from "@app/store/camp-checkout";
import { Button, Divider, Stack, Typography } from "@mui/material";
import { FormEvent, useMemo } from "react";
import { DatesInput } from "./DatesInput";
import { GuestsInput } from "./GuestsInput";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { PaymentInput } from "./PaymentInput";

type Props = {
    camp: FetchedCamp;
};

export function CampCheckoutForm(props: Props): React.JSX.Element {
    const { perNightCost } = props.camp;
    const inputs = useCampCheckoutStore((state) => ({
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

    const handleSubmit = useMutation({
        async mutationFn(e: FormEvent<HTMLFormElement>) {
            e.preventDefault();
        },
    });
    console.log(inputs);
    return (
        <Stack
            component="form"
            gap="1rem"
            my="1rem"
            onSubmit={handleSubmit.mutateAsync}
        >
            <DatesInput />
            <GuestsInput />

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

                <PaymentInput />

                <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    sx={{ height: "56px", mt: "2rem" }}
                    disabled={
                        totalCost === 0 ||
                        !inputs.checkInDate ||
                        !inputs.checkOutDate ||
                        inputs.adultGuestsCount === 0 ||
                        handleSubmit.isPending
                    }
                    startIcon={
                        <Image
                            src="/figmoji/tent-with-tree.png"
                            alt="Pay for booking"
                            width={20}
                            height={20}
                        />
                    }
                >
                    Pay
                </Button>
            </Stack>
        </Stack>
    );
}
