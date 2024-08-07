import { useUser } from "@app/hooks/auth";
import { useAuthStore } from "@app/store/auth";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

// const GradientText = styled(Typography)({
//     backgroundImage: `linear-gradient(to right, #656E60 20%, #ADBCA5 30%, #656E60 70%, #ADBCA5 80%)`,
//     WebkitBackgroundClip: "text",
//     backgroundClip: "text",
//     WebkitTextFillColor: "transparent",
//     textFillColor: "transparent",
//     backgroundSize: "500% auto",
//     animation: "textShine 5s ease-in-out infinite alternate",
//     "@keyframes textShine": {
//         "0%": {
//             backgroundPosition: "0% 50%",
//         },
//         "100%": {
//             backgroundPosition: "100% 50%",
//         },
//     },
// }) as typeof Typography;

export function Banner(): React.JSX.Element | null {
    const theme = useTheme();
    const { isLoggedIn } = useUser();

    return (
        <Stack
            sx={(theme) => ({
                // boxShadow: `0px 4px 12px rgba(101, 110, 96, 0.2)`,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                p: "2rem",
                borderRadius: "20px",
                maxWidth: "1312px",
                width: "100%",
                bgcolor: "#F4F7F3",
                gap: "2rem",
                [theme.breakpoints.down("sm")]: {
                    flexDirection: "column",
                    gap: "1.5rem",
                    p: "1rem",
                    display: "none",
                },
            })}
        >
            <Stack gap="1.5rem" sx={{ flexGrow: 1 }}>
                <Typography
                    variant="h1"
                    sx={(theme) => ({
                        fontSize: "72px",
                        fontWeight: "bold",
                        [theme.breakpoints.down("sm")]: {
                            fontSize: "48px",
                        },
                    })}
                >
                    Get some time to{" "}
                    <Typography
                        component="span"
                        variant="h1"
                        sx={(theme) => ({
                            fontSize: "72px",
                            fontWeight: "bold",
                            [theme.breakpoints.down("sm")]: {
                                fontSize: "48px",
                            },
                        })}
                    >
                        live
                    </Typography>
                </Typography>

                <Typography variant="body1">
                    Have fun and spend time with your friends, family, pet or go
                    solo. Find a camp for your needs!
                </Typography>

                <ActionButton />
            </Stack>

            {/* Image */}
            <Box
                sx={{
                    flexGrow: 1,
                    width: "70%",
                    height: "400px",
                    position: "relative",
                    borderRadius: "24px",
                    overflow: "hidden",
                    [theme.breakpoints.down("sm")]: {
                        display: "none",
                    },
                }}
            >
                <Image
                    src="/images/banner.png"
                    alt="Banner"
                    fill
                    loading="lazy"
                    priority={false}
                    style={{ objectFit: "cover" }}
                />
            </Box>
        </Stack>
    );
}

function ActionButton() {
    const { isLoggedIn } = useUser();
    const { openSignupModal } = useAuthStore((state) => ({
        openSignupModal: state.openSignupModal,
    }));

    if (!isLoggedIn) {
        return (
            <Button
                variant="contained"
                disableElevation
                sx={(theme) => ({
                    height: "60px",
                    width: "fit-content",
                    px: "2rem",
                    [theme.breakpoints.down("sm")]: {
                        width: "100%",
                    },
                })}
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
        );
    }

    return (
        <Button
            variant="contained"
            disableElevation
            LinkComponent={Link}
            href="/search"
            sx={(theme) => ({
                height: "60px",
                width: "fit-content",
                px: "2rem",
                [theme.breakpoints.down("sm")]: {
                    width: "100%",
                },
            })}
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
            Search Camps
        </Button>
    );
}
