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
import { queryClient } from "@app/lib/react-query";
import { login } from "@app/services/auth";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Toast } from "@app/components/shared/toast/Toast";
import { Loader } from "@app/components/shared/loader/Loader";

const LoginSchema = z.object({
    email: z.string({ required_error: "Required" }).email(),
    password: z
        .string({ required_error: "Required" })
        .min(8, { message: "Minimum 8 characters required" })
        .max(20, { message: "Maximum 20 characters allowed" }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export function LoginModal(): React.JSX.Element {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LoginSchemaType>({ resolver: zodResolver(LoginSchema) });
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const { onClose, isOpen, openSignupModal } = useAuthStore((state) => ({
        onClose: state.closeLoginModal,
        isOpen: state.isLoginModalOpen,
        openSignupModal: state.openSignupModal,
    }));
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);

    const mutation = useMutation({
        mutationFn: login,
        async onSuccess(data, variables, context) {
            if (data.success) {
                setShowSuccessSnackbar(true);
                await queryClient.invalidateQueries({ queryKey: ["user"] });
                reset();
                onClose();
            } else {
                setShowErrorSnackbar(true);
            }
        },
        onError(error, variables, context) {
            setShowErrorSnackbar(true);
        },
    });

    function handleSignupClick(): void {
        openSignupModal();
        onClose();
    }

    return (
        <>
            <Dialog
                data-test="login-modal"
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
                        data-test="login-form"
                        component="form"
                        gap="1.5rem"
                        onSubmit={handleSubmit((data) =>
                            mutation.mutateAsync(data)
                        )}
                    >
                        <Stack gap="1.5rem">
                            <TextField
                                data-test="login-email-input"
                                label="Email address"
                                placeholder="Email address"
                                variant="outlined"
                                {...register("email")}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                FormHelperTextProps={{
                                    className: "helper-text",
                                }}
                            />

                            <TextField
                                data-test="login-password-input"
                                label="Password"
                                placeholder="Password"
                                variant="outlined"
                                {...register("password")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                FormHelperTextProps={{
                                    className: "helper-text",
                                }}
                            />

                            <Button
                                data-test="login-submit-button"
                                type="submit"
                                variant="contained"
                                disableElevation
                                startIcon={
                                    mutation.isPending ? null : (
                                        <Image
                                            src="/figmoji/tent-with-tree.png"
                                            alt="Tent with Tree"
                                            width={23.81}
                                            height={23.42}
                                            style={{ display: "inline-block" }}
                                        />
                                    )
                                }
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? <Loader /> : "Login"}
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
                            href="/forgot-password"
                            onClick={onClose}
                        >
                            Forgot password?
                        </DialogContentText>
                    </Stack>
                </DialogContent>
            </Dialog>

            <Toast
                open={showSuccessSnackbar}
                onClose={() => setShowSuccessSnackbar(false)}
                severity="success"
                message="Logged in successfully"
            />

            <Toast
                open={showErrorSnackbar}
                onClose={() => setShowErrorSnackbar(false)}
                severity="error"
                message={
                    mutation.error instanceof Error
                        ? mutation.error.message
                        : mutation.data?.message ?? "An error occurred"
                }
            />
        </>
    );
}
