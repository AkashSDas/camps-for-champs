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
import { useMutation } from "@tanstack/react-query";
import { signup } from "@app/services/auth";
import { useState } from "react";
import { queryClient } from "@app/lib/react-query";
import { useRouter } from "next/router";
import { Toast } from "@app/components/shared/toast/Toast";

const SignUpSchema = z.object({
    email: z.string({ required_error: "Required" }).email(),
    firstName: z
        .string({ required_error: "Required" })
        .min(3, { message: "Minimum 3 characters required" })
        .max(20, { message: "Maximum 20 characters allowed" }),
    lastName: z
        .string({ required_error: "Required" })
        .min(3, { message: "Minimum 3 characters required" })
        .max(20, { message: "Maximum 20 characters allowed" }),
    password: z
        .string({ required_error: "Required" })
        .min(8, { message: "Minimum 8 characters required" })
        .max(20, { message: "Maximum 20 characters allowed" }),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export function SignupModal(): React.JSX.Element {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) });
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const { onClose, isOpen, openLoginModal } = useAuthStore((state) => ({
        onClose: state.closeSignupModal,
        isOpen: state.isSignupModalOpen,
        openLoginModal: state.openLoginModal,
    }));
    const router = useRouter();
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);

    const mutation = useMutation({
        mutationFn: signup,
        async onSuccess(data, variables, context) {
            if (data.success) {
                setShowSuccessSnackbar(true);
                await queryClient.invalidateQueries({ queryKey: ["user"] });
                reset();
                onClose();
                await router.push("/");
            } else {
                setShowErrorSnackbar(true);
            }
        },
        onError(error, variables, context) {
            setShowErrorSnackbar(true);
        },
    });

    function handleLoginClick(): void {
        openLoginModal();
        onClose();
    }

    return (
        <>
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
                <DialogTitle variant="h2">Signup</DialogTitle>
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
                        Join the trill today and meet the nature tomorrow!
                    </DialogContentText>

                    <Stack
                        component="form"
                        gap="1.5rem"
                        onSubmit={handleSubmit((data) =>
                            mutation.mutateAsync(data)
                        )}
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

                            <Stack
                                direction="row"
                                gap="1.5rem"
                                sx={(theme) => ({
                                    [theme.breakpoints.down("sm")]: {
                                        flexDirection: "column",
                                    },
                                })}
                            >
                                <TextField
                                    label="First name"
                                    placeholder="First name"
                                    variant="outlined"
                                    {...register("firstName")}
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
                                    sx={{ width: "100%" }}
                                />

                                <TextField
                                    label="Last name"
                                    placeholder="Last name"
                                    variant="outlined"
                                    {...register("lastName")}
                                    error={!!errors.lastName}
                                    helperText={errors.lastName?.message}
                                    sx={{ width: "100%" }}
                                />
                            </Stack>

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
                                Signup
                            </Button>
                        </Stack>
                    </Stack>

                    <Stack gap="0.5rem" mt="1.5rem">
                        <DialogContentText variant="subtitle2">
                            Already have an account?{" "}
                            <DialogContentText
                                variant="subtitle2"
                                component="span"
                                onClick={handleLoginClick}
                                sx={{
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    fontWeight: 500,
                                }}
                            >
                                Login
                            </DialogContentText>
                        </DialogContentText>

                        <DialogContentText variant="subtitle2">
                            By continuing, you agree to our terms and privacy
                            policy.
                        </DialogContentText>
                    </Stack>
                </DialogContent>
            </Dialog>

            <Toast
                open={showSuccessSnackbar}
                onClose={() => setShowSuccessSnackbar(false)}
                severity="success"
                message="Account created successfully"
            />

            <Toast
                open={showErrorSnackbar}
                onClose={() => setShowErrorSnackbar(false)}
                severity="error"
                message={
                    mutation.error instanceof Error
                        ? mutation.error.message
                        : "An error occurred"
                }
            />
        </>
    );
}
