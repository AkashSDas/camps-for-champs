import { LoginModal } from "@app/components/auth/login-modal/LoginModal";
import { SignupModal } from "@app/components/auth/signup-modal/SignupModal";
import { useUser } from "@app/hooks/auth";
import { queryClient } from "@app/lib/react-query";
import { logout } from "@app/services/auth";
import { useAuthStore } from "@app/store/auth";
import {
    AppBar,
    Button,
    IconButton,
    Slide,
    Stack,
    styled,
    useScrollTrigger,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "../loader/Loader";
import { MobileNavMenu } from "../mobile-nav-menu/MobileNavMenu";

const LogoImage = styled(Image)({
    cursor: "pointer",
});

type Props = {
    variant?: "base" | "light";
};

export function Navbar(props: Props): React.JSX.Element {
    const trigger = useScrollTrigger();
    const { openSignupModal, openLoginModal } = useAuthStore((state) => ({
        openSignupModal: state.openSignupModal,
        openLoginModal: state.openLoginModal,
    }));
    const { isLoggedIn } = useUser();

    const logoutMutation = useMutation({
        mutationFn: logout,
        async onSuccess(data, variables, context) {
            await queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            <AppBar
                color="default"
                elevation={0}
                sx={(theme) => {
                    return {
                        bgcolor:
                            props.variant === "light" ? "primary.50" : "white",
                        borderBottom:
                            props.variant === "light" ? "none" : "1px solid",
                        borderBottomColor: "grey.300",
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
                <MobileNavMenu />

                <Link href="/">
                    <LogoImage
                        src="/text-logo.png"
                        alt="Camps for Champs"
                        width={107.55}
                        height={48.74}
                        priority
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
                    {isLoggedIn ? (
                        <>
                            <Button
                                variant="text"
                                onClick={() => logoutMutation.mutateAsync()}
                            >
                                {logoutMutation.isPending ? (
                                    <Loader />
                                ) : (
                                    "Logout"
                                )}
                            </Button>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </Stack>

                <SignupModal />
                <LoginModal />
            </AppBar>
        </Slide>
    );
}
