import { useUser } from "@app/hooks/auth";
import { bodyFont } from "@app/pages/_app";
import { useAuthStore } from "@app/store/auth";
import { ArrowForwardIos, Close } from "@mui/icons-material";
import {
    Button,
    Dialog,
    DialogContent,
    Divider,
    IconButton,
    Stack,
    styled,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { Loader } from "../loader/Loader";
import { queryClient } from "@app/lib/react-query";
import { logout } from "@app/services/auth";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

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
    const { isLoggedIn } = useUser();

    const logoutMutation = useMutation({
        mutationFn: logout,
        async onSuccess(data, variables, context) {
            await queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });

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
                        {isLoggedIn ? (
                            <>
                                <MenuButton
                                    LinkComponent={Link}
                                    href="/profile"
                                    endIcon={<ArrowForwardIos />}
                                >
                                    Profile
                                </MenuButton>
                                <MenuButton
                                    LinkComponent={Link}
                                    href="/liked-camps"
                                    endIcon={<ArrowForwardIos />}
                                >
                                    Liked camps
                                </MenuButton>
                                <MenuButton
                                    LinkComponent={Link}
                                    href="/orders"
                                    endIcon={<ArrowForwardIos />}
                                >
                                    Bookings
                                </MenuButton>

                                <MenuButton
                                    endIcon={<ArrowForwardIos />}
                                    onClick={() => logoutMutation.mutateAsync()}
                                >
                                    {logoutMutation.isPending ? (
                                        <Loader />
                                    ) : (
                                        "Logout"
                                    )}
                                </MenuButton>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
}
