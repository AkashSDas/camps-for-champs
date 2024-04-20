import { Loader } from "@app/components/shared/loader/Loader";
import { Navbar } from "@app/components/shared/navbar/Navbar";
import { Toast } from "@app/components/shared/toast/Toast";
import { forgotPassword, resetPassword } from "@app/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ResetPasswordFormSchema = z.object({
    password: z
        .string({ required_error: "Required" })
        .min(8, { message: "Minimum 8 characters required" })
        .max(20, { message: "Maximum 20 characters allowed" }),
});

const ResetPasswordSchema = z.object({
    token: z.string(),
    ...ResetPasswordFormSchema.shape,
});

type ResetPasswordFormSchemaType = z.infer<typeof ResetPasswordFormSchema>;
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

export default function ForgotPassword(): React.JSX.Element {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ResetPasswordFormSchemaType>({
        resolver: zodResolver(ResetPasswordFormSchema),
    });
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
    const { query } = useRouter();

    const mutation = useMutation({
        mutationFn: (data: ResetPasswordFormSchemaType) => {
            if (!query.token) {
                return Promise.resolve({
                    success: false,
                    message: "Invalid token",
                });
            }
            return resetPassword({ ...data, token: query.token as string });
        },
        async onSuccess(data, variables, context) {
            if (data.success) {
                setShowSuccessSnackbar(true);
                reset();
            } else {
                setShowErrorSnackbar(true);
            }
        },
        onError(error, variables, context) {
            setShowErrorSnackbar(true);
        },
    });

    return (
        <Box>
            <Navbar />

            <Grid container justifyContent="center">
                <Grid item xs={12} sm={10} md={8} lg={6} mt="4rem" px="1rem">
                    <Typography component="h1" variant="h4">
                        New Password
                    </Typography>

                    <Typography variant="body1" mt="1rem" fontSize="18px">
                        Complete your password reset. Enter your new password.
                    </Typography>

                    <Stack
                        component="form"
                        gap="1.5rem"
                        mt="4rem"
                        onSubmit={handleSubmit((data) =>
                            mutation.mutateAsync(data)
                        )}
                    >
                        <Stack gap="1.5rem">
                            <TextField
                                label="New password"
                                placeholder="New password"
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
                                {mutation.isPending ? (
                                    <Loader />
                                ) : (
                                    "Update Password"
                                )}
                            </Button>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>

            <Toast
                open={showSuccessSnackbar}
                onClose={() => setShowSuccessSnackbar(false)}
                severity="success"
                message="Password updated successfully. You can now login with your new password."
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
        </Box>
    );
}
