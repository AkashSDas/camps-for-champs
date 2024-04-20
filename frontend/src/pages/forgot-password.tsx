import { Loader } from "@app/components/shared/loader/Loader";
import { Navbar } from "@app/components/shared/navbar/Navbar";
import { Toast } from "@app/components/shared/toast/Toast";
import { forgotPassword } from "@app/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ForgotPasswordSchema = z.object({
    email: z.string({ required_error: "Required" }).email(),
});

export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPassword(): React.JSX.Element {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ForgotPasswordSchemaType>({
        resolver: zodResolver(ForgotPasswordSchema),
    });
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);

    const mutation = useMutation({
        mutationFn: forgotPassword,
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
                        Forgot Your Password?
                    </Typography>

                    <Typography variant="body1" mt="1rem" fontSize="18px">
                        Enter your email address and get password reset
                        instructions.
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
                                label="Email address"
                                placeholder="Email address"
                                variant="outlined"
                                {...register("email")}
                                error={!!errors.email}
                                helperText={errors.email?.message}
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
                                    "Send Instructions"
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
                message="Password reset instructions sent to your email"
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
