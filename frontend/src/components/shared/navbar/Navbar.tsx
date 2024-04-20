import { LoginModal } from "@app/components/auth/login-modal/LoginModal";
import { SignupModal } from "@app/components/auth/signup-modal/SignupModal";
import { useAuthStore } from "@app/store/auth";
import { AppBar, Button, IconButton, Stack, styled } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const LogoImage = styled(Image)({
    cursor: "pointer",
});

export function Navbar(): React.JSX.Element {
    const { openSignupModal, openLoginModal } = useAuthStore((state) => ({
        openSignupModal: state.openSignupModal,
        openLoginModal: state.openLoginModal,
    }));

    return (
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={(theme) => {
                return {
                    bgcolor: "primary.50",
                    flexDirection: "row",
                    gap: "16px",
                    alignItems: "center",
                    justifyContent: "start",
                    paddingInline: "16px",
                    height: "70px",
                    [theme.breakpoints.up("md")]: {
                        height: "80px",
                        paddingInline: "64px",
                        justifyContent: "space-between",
                    },
                };
            }}
        >
            <IconButton
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

            <Link href="/">
                <LogoImage
                    src="/text-logo.png"
                    alt="Camps for Champs"
                    width={107.55}
                    height={48.74}
                />
            </Link>

            <Stack
                flexDirection="row"
                gap="48px"
                sx={(theme) => {
                    return {
                        display: "none",
                        [theme.breakpoints.up("md")]: {
                            display: "flex",
                        },
                    };
                }}
            >
                <Button variant="text" onClick={openLoginModal}>
                    Login
                </Button>

                <Button
                    variant="contained"
                    disableElevation
                    onClick={openSignupModal}
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
                    Join the Thrill
                </Button>
            </Stack>

            <SignupModal />
            <LoginModal />
        </AppBar>
    );
}
