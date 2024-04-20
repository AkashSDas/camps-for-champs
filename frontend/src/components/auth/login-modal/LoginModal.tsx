import {
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Close } from "@mui/icons-material";
import { useAuthStore } from "@app/store/auth";
import Link from "next/link";

const LoginSchema = z.object({
    email: z.string({ required_error: "Required" }).email(),
    password: z
        .string({ required_error: "Required" })
        .min(8, { message: "Minimum 8 characters required" })
        .max(20, { message: "Maximum 20 characters allowed" }),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

export function LoginModal(): React.JSX.Element {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchemaType>({ resolver: zodResolver(LoginSchema) });
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const { onClose, isOpen, openSignupModal } = useAuthStore((state) => ({
        onClose: state.closeLoginModal,
        isOpen: state.isLoginModalOpen,
        openSignupModal: state.openSignupModal,
    }));

    function handleSignupClick(): void {
        openSignupModal();
        onClose();
    }

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
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
            <DialogTitle variant="h2">Login</DialogTitle>
            <IconButton
                aria-label="Close"
                sx={(theme) => ({
                    position: "absolute",
                    right: "24px",
                    top: "16px",
                    color: theme.palette.grey[500],
                })}
                onClick={onClose}
            >
                <Close />
            </IconButton>

            <DialogContent>
                <DialogContentText fontWeight={500} mb="1.5rem">
                    {`Welcome back! Let's get you outside.`}
                </DialogContentText>

                <Stack
                    component="form"
                    gap="1.5rem"
                    onSubmit={handleSubmit((data) => console.log(data))}
                >
                    <Stack gap="1.5rem">
                        <TextField
                            label="Email address"
                            placeholder="Email address"
                            variant="outlined"
                            {...register("email")}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <TextField
                            label="Password"
                            placeholder="Password"
                            variant="outlined"
                            {...register("password")}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disableElevation
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
                            Login
                        </Button>
                    </Stack>
                </Stack>

                <Stack gap="0.5rem" mt="1.5rem">
                    <DialogContentText variant="subtitle2">
                        {`Don't have an account`}?{" "}
                        <DialogContentText
                            variant="subtitle2"
                            component="span"
                            onClick={handleSignupClick}
                            sx={{
                                textDecoration: "underline",
                                cursor: "pointer",
                                fontWeight: 500,
                            }}
                        >
                            Signup
                        </DialogContentText>
                    </DialogContentText>

                    <DialogContentText
                        variant="subtitle2"
                        component={Link}
                        href="/reset-password"
                    >
                        Forgot password?
                    </DialogContentText>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
