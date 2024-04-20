import { bodyFont } from "@app/pages/_app";
import { useAuthStore } from "@app/store/auth";
import { ArrowForwardIos, Close } from "@mui/icons-material";
import {
    Button,
    ButtonBase,
    Dialog,
    DialogContent,
    Divider,
    IconButton,
    Stack,
    Typography,
    styled,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";

const MenuButton = styled(Button)((theme) => {
    return {
        height: "54px",
        fontSize: "24px",
        fontWeight: 600,
        fontFamily: bodyFont.style.fontFamily,
        width: "100%",
        justifyContent: "space-between",
    };
});

export function MobileNavMenu(): React.JSX.Element {
    const [open, setOpen] = useState(false);
    const { openLoginModal, openSignupModal } = useAuthStore((state) => ({
        openLoginModal: state.openLoginModal,
        openSignupModal: state.openSignupModal,
    }));

    function changeOpen(v: typeof open) {
        return () => setOpen(v);
    }

    return (
        <>
            <IconButton
                onClick={changeOpen(true)}
                sx={(theme) => {
                    return {
                        height: "40px",
                        width: "40px",
                        bgcolor: "grey.50",
                        border: "1.5px solid",
                        borderColor: "grey.400",
                        "&:hover": {
                            bgcolor: "grey.100",
                        },
                        "& .MuiTouchRipple-root .MuiTouchRipple-child": {
                            bgcolor: "grey.500",
                        },
                        [theme.breakpoints.up("md")]: {
                            display: "none",
                        },
                    };
                }}
            >
                <Image
                    src="/icons/menu-line-horizontal.svg"
                    alt="Menu bar"
                    width={28}
                    height={28}
                />
            </IconButton>

            <Dialog
                open={open}
                fullScreen
                onClose={changeOpen(false)}
                sx={{ borderRadius: "0px" }}
            >
                <IconButton
                    aria-label="Close"
                    onClick={changeOpen(false)}
                    sx={(theme) => {
                        return {
                            m: "1rem",
                            ml: "36px",
                            height: "40px",
                            width: "40px",
                            bgcolor: "grey.50",
                            border: "1.5px solid",
                            borderColor: "grey.400",
                            "&:hover": {
                                bgcolor: "grey.100",
                            },
                            "& .MuiTouchRipple-root .MuiTouchRipple-child": {
                                bgcolor: "grey.500",
                            },
                        };
                    }}
                >
                    <Close />
                </IconButton>

                <DialogContent>
                    <Stack
                        divider={<Divider sx={{ borderColor: "grey.200" }} />}
                        gap="0.5rem"
                    >
                        <MenuButton endIcon={<ArrowForwardIos />}>
                            About
                        </MenuButton>

                        <MenuButton
                            endIcon={<ArrowForwardIos />}
                            onClick={() => {
                                openLoginModal();
                                setOpen(false);
                            }}
                        >
                            Login
                        </MenuButton>

                        <MenuButton
                            endIcon={<ArrowForwardIos />}
                            onClick={() => {
                                openSignupModal();
                                setOpen(false);
                            }}
                        >
                            Signup
                        </MenuButton>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
}
