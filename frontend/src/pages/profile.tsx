import { Loader } from "@app/components/shared/loader/Loader";
import { Navbar } from "@app/components/shared/navbar/Navbar";
import { Toast } from "@app/components/shared/toast/Toast";
import { useUser } from "@app/hooks/auth";
import { updateProfile } from "@app/services/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const UpdateProfileFormSchema = z.object({
    firstName: z
        .string({ required_error: "Required" })
        .min(2, {
            message: "Minimum 2 characters required",
        })
        .max(50, { message: "Maximum 50 characters allowed" }),
    lastName: z
        .string({ required_error: "Required" })
        .min(2, {
            message: "Minimum 2 characters required",
        })
        .max(50, { message: "Maximum 50 characters allowed" }),
    email: z.string({ required_error: "Required" }).email({
        message: "Invalid email",
    }),
});

type UpdateProfileFormSchemaType = z.infer<typeof UpdateProfileFormSchema>;

export default function ProfilePage(): React.JSX.Element {
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
    const imgRef = useRef<HTMLInputElement | null>(null);
    const [img, setImg] = useState<File | null>(null);
    const { user } = useUser();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateProfileFormSchemaType>({
        resolver: zodResolver(UpdateProfileFormSchema),
        defaultValues: {
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            email: user?.email ?? "",
        },
    });

    const mutation = useMutation({
        mutationFn: (data: UpdateProfileFormSchemaType) => {
            const formData = new FormData();
            formData.append("first_name", data.firstName);
            formData.append("last_name", data.lastName);
            formData.append("email", data.email);
            if (img) {
                formData.append("profile_pic", img);
            }

            return updateProfile(formData);
        },
        async onSuccess(data, variables, context) {
            if (data.success) {
                setShowSuccessSnackbar(true);
            } else {
                setShowErrorSnackbar(true);
            }
        },
        onError(error, variables, context) {
            setShowErrorSnackbar(true);
        },
    });

    useEffect(
        function updateForm() {
            reset({
                firstName: user?.firstName ?? "",
                lastName: user?.lastName ?? "",
                email: user?.email ?? "",
            });
        },
        [user]
    );

    return (
        <Box position="relative">
            <Head>
                <title>Profile</title>
            </Head>
            <Navbar />

            <Grid container justifyContent="center">
                <Grid item xs={12} sm={10} md={8} lg={6} mt="144px" px="1rem">
                    <Typography component="h1" variant="h4">
                        Profile
                    </Typography>

                    <Stack
                        component="form"
                        gap="1.5rem"
                        mt="2rem"
                        onSubmit={handleSubmit((data) => {
                            mutation.mutateAsync(data);
                        })}
                    >
                        <Stack gap="1.5rem">
                            <Box>
                                <Image
                                    src={
                                        (img && URL.createObjectURL(img)) ??
                                        user?.profilePic ??
                                        "/images/user.png"
                                    }
                                    alt="Profile Picture"
                                    width={120}
                                    height={120}
                                    style={{
                                        cursor: "pointer",
                                        objectFit: "cover",
                                        borderRadius: "16px",
                                    }}
                                    onClick={() => imgRef.current?.click()}
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    ref={imgRef}
                                    onChange={(e) => {
                                        if (
                                            e.target.files &&
                                            e.target.files[0]
                                        ) {
                                            setImg(e.target.files[0]!);
                                        }
                                    }}
                                />
                            </Box>

                            <TextField
                                label="First name"
                                placeholder=""
                                variant="outlined"
                                {...register("firstName")}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />

                            <TextField
                                label="Last name"
                                placeholder=""
                                variant="outlined"
                                {...register("lastName")}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />

                            <TextField
                                label="Email"
                                placeholder=""
                                variant="outlined"
                                {...register("email")}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                disableElevation
                                sx={{ height: "54px" }}
                                startIcon={
                                    <Image
                                        src="/figmoji/tent-with-tree.png"
                                        alt="Tent with Tree"
                                        width={23.81}
                                        height={23.42}
                                        style={{ display: "inline-block" }}
                                    />
                                }
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? (
                                    <Loader />
                                ) : (
                                    "Update Profile"
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
                message="Profile updated successfully."
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
