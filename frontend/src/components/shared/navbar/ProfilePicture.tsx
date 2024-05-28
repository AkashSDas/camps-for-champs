import { queryClient } from "@app/lib/react-query";
import { logout } from "@app/services/auth";
import styled from "@emotion/styled";
import { Stack, Menu, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { type MouseEvent, useState } from "react";
import { Loader } from "../loader/Loader";
import Image from "next/image";

const MenuItem = styled(Stack)({
    gap: "8px",
    padding: "8px",
    borderRadius: "8px",
    height: "44px",
    alignItems: "center",
    cursor: "pointer",
    flexDirection: "row",
});

const actions = {
    profile: {
        label: "Profile",
        icon: "/icons/user-circle.png",
        href: "/profile",
    },
    likedCamps: {
        label: "Liked camps",
        icon: "/icons/heart.png",
        href: "/liked-camps",
    },
    bookings: {
        label: "Bookings",
        icon: "/icons/receipt.png",
        href: "/bookings",
    },
    logout: { label: "Logout", icon: "/icons/logout.png" },
};

export function ProfilePicture(): React.JSX.Element {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const logoutMutation = useMutation({
        mutationFn: logout,
        async onSuccess(data, variables, context) {
            await queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });

    function handleClick(event: MouseEvent<HTMLButtonElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <>
            <Image
                // src={user?.profilePic ?? "/images/user.png"}
                src={"/images/user.png"}
                alt="User"
                width={40}
                height={40}
                style={{ objectFit: "cover", cursor: "pointer" }}
                onClick={handleClick as any}
            />

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                sx={{
                    marginTop: "8px",
                    "& .MuiPaper-root": {
                        width: "100%",
                        maxWidth: "240px",
                        px: "4px",
                        borderRadius: "12px",
                        border: "2px solid",
                        borderColor: "grey.300",
                        boxShadow: "0px 4px 8px rgba(184, 190, 181, 0.25)",
                    },
                }}
            >
                <Link href={actions.profile.href}>
                    <MenuItem
                        sx={{
                            "&:hover": { bgcolor: "grey.200" },
                            "&:active": { bgcolor: "grey.300" },
                        }}
                    >
                        <Image
                            src={actions.profile.icon}
                            alt={actions.profile.label}
                            width={20}
                            height={20}
                        />

                        <Typography>{actions.profile.label}</Typography>
                    </MenuItem>
                </Link>

                <Link href={actions.likedCamps.href}>
                    <MenuItem
                        sx={{
                            "&:hover": { bgcolor: "grey.200" },
                            "&:active": { bgcolor: "grey.300" },
                        }}
                    >
                        <Image
                            src={actions.likedCamps.icon}
                            alt={actions.likedCamps.label}
                            width={20}
                            height={20}
                        />

                        <Typography>{actions.likedCamps.label}</Typography>
                    </MenuItem>
                </Link>

                <Link href={actions.bookings.href}>
                    <MenuItem
                        sx={{
                            "&:hover": { bgcolor: "grey.200" },
                            "&:active": { bgcolor: "grey.300" },
                        }}
                    >
                        <Image
                            src={actions.bookings.icon}
                            alt={actions.bookings.label}
                            width={20}
                            height={20}
                        />

                        <Typography>{actions.bookings.label}</Typography>
                    </MenuItem>
                </Link>

                <MenuItem
                    sx={{
                        "&:hover": { bgcolor: "grey.200" },
                        "&:active": { bgcolor: "grey.300" },
                    }}
                    onClick={() => logoutMutation.mutateAsync()}
                >
                    <Image
                        src={actions.logout.icon}
                        alt={actions.logout.label}
                        width={20}
                        height={20}
                    />

                    <Typography>
                        {logoutMutation.isPending ? (
                            <Loader />
                        ) : (
                            actions.logout.label
                        )}
                    </Typography>
                </MenuItem>
            </Menu>
        </>
    );
}
