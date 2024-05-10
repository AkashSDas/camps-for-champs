import { Close } from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import Image from "next/image";
import { useReducer, useState } from "react";
import { GuestsCounter } from "./GuestsCounter";
import { useSearchCampInputStore } from "@app/store/search-camp-input";
import { useCampBookingInputStore } from "@app/store/camp-booking-input";

type GuestsCount = {
    adults: number;
    children: number;
    pets: number;
};

type ActionType = "increment" | "decrement" | "reset";
type Payload = keyof GuestsCount;

const initialState: GuestsCount = {
    adults: 0,
    children: 0,
    pets: 0,
};

function reducer(
    state: GuestsCount,
    action: { type: ActionType; payload: Payload }
): GuestsCount {
    switch (action.type) {
        case "increment":
            return { ...state, [action.payload]: state[action.payload] + 1 };
        case "decrement":
            return { ...state, [action.payload]: state[action.payload] - 1 };
        case "reset":
            return initialState;
        default:
            return state;
    }
}

export function GuestsInput(): React.JSX.Element {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [guests, dispatch] = useReducer(reducer, initialState);
    const { setAdultsGuestsCount, setChildGuestsCount, setPetsCount } =
        useCampBookingInputStore((state) => ({
            setAdultsGuestsCount: state.setAdultGuestsCount,
            setChildGuestsCount: state.setChildGuestsCount,
            setPetsCount: state.setPetsCount,
        }));

    function closeModal(): void {
        setOpen(false);
    }

    function handleNextClick(): void {
        setAdultsGuestsCount(guests.adults);
        setChildGuestsCount(guests.children);
        setPetsCount(guests.pets);
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
                    placeholder="Add guests"
                    sx={{ pointerEvents: "none" }}
                    fullWidth
                    disabled
                    value={
                        guests.adults || guests.children || guests.pets
                            ? `${guests.adults} ${
                                  guests.adults === 1 ? "adult" : "adults"
                              }, ${guests.children} ${
                                  guests.children === 1 ? "child" : "children"
                              }, ${guests.pets} ${
                                  guests.pets === 1 ? "pet" : "pets"
                              }`
                            : ""
                    }
                    InputProps={{
                        startAdornment: (
                            <Image
                                src="/icons/user.png"
                                alt="Add guests"
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
                <DialogTitle variant="h2">Guests</DialogTitle>
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
                    <DialogContentText fontWeight={500} mb="1.5rem">
                        How many people are coming?
                    </DialogContentText>

                    <Stack gap="1.5rem">
                        <GuestsCounter
                            label="Adults"
                            description="Ages 13 or above"
                            count={guests.adults}
                            onIncrement={() =>
                                dispatch({
                                    type: "increment",
                                    payload: "adults",
                                })
                            }
                            onDecrement={() =>
                                dispatch({
                                    type: "decrement",
                                    payload: "adults",
                                })
                            }
                        />

                        <GuestsCounter
                            label="Children"
                            description="Ages 2-12"
                            count={guests.children}
                            onIncrement={() =>
                                dispatch({
                                    type: "increment",
                                    payload: "children",
                                })
                            }
                            onDecrement={() =>
                                dispatch({
                                    type: "decrement",
                                    payload: "children",
                                })
                            }
                        />

                        <GuestsCounter
                            label="Pets"
                            count={guests.pets}
                            onIncrement={() =>
                                dispatch({ type: "increment", payload: "pets" })
                            }
                            onDecrement={() =>
                                dispatch({ type: "decrement", payload: "pets" })
                            }
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disableElevation
                            onClick={handleNextClick}
                            disabled={false}
                        >
                            Next
                        </Button>
                    </Stack>

                    <Button
                        variant="text"
                        onClick={() => {
                            dispatch({ type: "reset", payload: "adults" });
                            closeModal();
                        }}
                        sx={{
                            textDecoration: "underline",
                            mt: "1rem",
                            fontWeight: "500",
                        }}
                    >
                        Clear
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}
