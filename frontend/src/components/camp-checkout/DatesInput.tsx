import {
    Dialog,
    DialogTitle,
    TextField,
    IconButton,
    useMediaQuery,
    useTheme,
    Box,
    Button,
    DialogContent,
    DialogContentText,
    Stack,
} from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { Close } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { useCampBookingInputStore } from "@app/store/camp-booking-input";
import { useCampCheckoutStore } from "@app/store/camp-checkout";

function useDateRangeSelection() {
    const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
    const [checkOut, setCheckOut] = useState<Dayjs | null>(null);
    const [checkInError, setCheckInError] = useState<string | null>(null);
    const [checkOutError, setCheckOutError] = useState<string | null>(null);

    function handleCheckInChange(date: Dayjs | null): void {
        if (date === null) {
            setCheckInError(null);
            setCheckIn(date);
            return;
        }

        if (date && checkOut && date.isAfter(checkOut)) {
            setCheckInError("Check-in date must be before check-out date");
            return;
        }

        setCheckInError(null);
        setCheckOutError(null);
        setCheckIn(date);
    }

    function handleCheckOutChange(date: Dayjs | null): void {
        if (date === null) {
            setCheckOutError(null);
            setCheckOut(date);
            return;
        }

        if (!checkIn) {
            setCheckInError("Please select a check-in date first");
            return;
        }
        console.log(date && date?.isBefore(checkIn));
        if (date && date.isBefore(checkIn)) {
            setCheckOutError("Check-out date must be after check-in date");
            return;
        }
        setCheckOutError(null);
        setCheckOut(date);
    }

    return {
        checkIn,
        checkOut,
        checkInError,
        checkOutError,
        handleCheckInChange,
        handleCheckOutChange,
    };
}

export function DatesInput(): React.JSX.Element {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const dates = useDateRangeSelection();
    const { setCheckIn, setCheckOut } = useCampCheckoutStore((state) => ({
        setCheckIn: state.setCheckInDate,
        setCheckOut: state.setCheckOutDate,
    }));

    function closeModal(): void {
        setOpen(false);
    }

    function handleNextClick(): void {
        if (dates.checkInError || dates.checkOutError) return;
        setCheckIn(dates.checkIn?.toDate() ?? null);
        setCheckOut(dates.checkOut?.toDate() ?? null);
        closeModal();
    }

    return (
        <>
            <Box
                onClick={() => setOpen(true)}
                sx={{
                    flexGrow: 1,
                    cursor: "pointer",
                    width: "100%",
                }}
            >
                <TextField
                    sx={{ pointerEvents: "none" }}
                    placeholder="Add dates"
                    fullWidth
                    disabled
                    value={
                        dates.checkIn || dates.checkOut
                            ? `${dates.checkIn?.format("MMM D, YYYY") ?? ""} - ${
                                  dates.checkOut?.format("MMM D, YYYY") ?? ""
                              }`
                            : ""
                    }
                    InputProps={{
                        startAdornment: (
                            <Image
                                src="/icons/calendar.png"
                                alt="Check in and out dates"
                                height={24}
                                width={24}
                                style={{ marginRight: "0.5rem" }}
                            />
                        ),
                    }}
                />
            </Box>

            <Dialog
                open={open}
                onClose={closeModal}
                fullScreen={fullScreen}
                PaperProps={{
                    sx: {
                        borderRadius: "24px",
                        width: "600px",
                        [theme.breakpoints.down("sm")]: {
                            borderRadius: "0px",
                        },
                    },
                }}
            >
                <DialogTitle variant="h2">Stay Period</DialogTitle>
                <IconButton
                    aria-label="Close"
                    sx={(theme) => ({
                        position: "absolute",
                        right: "24px",
                        top: "16px",
                        color: theme.palette.grey[500],
                    })}
                    onClick={closeModal}
                >
                    <Close />
                </IconButton>

                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DialogContentText fontWeight={500} mb="1.5rem">
                            Enter the dates you want to stay at the campsite.
                        </DialogContentText>

                        <Stack gap="1.5rem">
                            <DatePicker
                                label="Check in"
                                value={dates.checkIn}
                                onChange={dates.handleCheckInChange}
                                slotProps={{
                                    textField: {
                                        helperText: dates.checkInError,
                                        error: !!dates.checkInError,
                                    },
                                }}
                                disablePast
                            />

                            <DatePicker
                                label="Check out"
                                value={dates.checkOut}
                                onChange={dates.handleCheckOutChange}
                                slotProps={{
                                    textField: {
                                        helperText: dates.checkOutError,
                                        error: !!dates.checkOutError,
                                    },
                                }}
                                disablePast
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                disableElevation
                                onClick={handleNextClick}
                                disabled={
                                    dates.checkInError !== null ||
                                    dates.checkOutError !== null ||
                                    !dates.checkIn ||
                                    !dates.checkOut
                                }
                            >
                                Next
                            </Button>
                        </Stack>
                    </LocalizationProvider>

                    <Button
                        variant="text"
                        onClick={() => {
                            setCheckIn(null);
                            setCheckOut(null);
                            dates.handleCheckInChange(null);
                            dates.handleCheckOutChange(null);
                            closeModal();
                        }}
                        sx={{
                            textDecoration: "underline",
                            mt: "1rem",
                            fontWeight: "500",
                        }}
                    >
                        Clear dates
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}
