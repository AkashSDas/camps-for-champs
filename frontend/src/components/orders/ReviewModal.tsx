import { theme } from "@app/lib/styles";
import { Close } from "@mui/icons-material";
import {
    Dialog,
    DialogTitle,
    IconButton,
    DialogContent,
    DialogContentText,
    Stack,
    TextField,
    Button,
    Rating,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { Loader } from "../shared/loader/Loader";
import { addReview } from "@app/services/reviews";
import { useUser } from "@app/hooks/auth";
import { Toast } from "../shared/toast/Toast";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    fullScreen: boolean;
    campId: number;
};

export function ReviewModal(props: Props) {
    const { isOpen, onClose, fullScreen } = props;
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
    const queryClient = useQueryClient();
    const { user } = useUser();

    const mutation = useMutation({
        async mutationFn() {
            return addReview({ rating, comment, campId: props.campId });
        },
        async onSuccess(data, variables, context) {
            setShowSuccessSnackbar(true);
            await queryClient.invalidateQueries({
                queryKey: ["orders", user?.id],
            });
            onClose();
        },
        onError(error, variables, context) {
            setShowErrorSnackbar(true);
        },
    });

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
                <DialogTitle variant="h2">Add Review</DialogTitle>
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
                        {`How was your stay?`}
                    </DialogContentText>

                    <Stack gap="1.5rem">
                        <Stack gap="1.5rem">
                            <Rating
                                name="rating"
                                value={rating}
                                onChange={(_, newValue) => {
                                    setRating(newValue ?? 0);
                                }}
                                size="large"
                                icon={<FavoriteIcon fontSize="inherit" />}
                                emptyIcon={
                                    <FavoriteBorderIcon fontSize="inherit" />
                                }
                            />

                            <TextField
                                label="Comment"
                                placeholder="Do you liked it?"
                                onChange={(e) => setComment(e.target.value)}
                                variant="outlined"
                                type="text"
                                required
                                InputProps={{ minRows: 2 }}
                                FormHelperTextProps={{
                                    className: "helper-text",
                                }}
                            />

                            <Button
                                type="button"
                                onClick={mutation.mutateAsync as any}
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
                                {mutation.isPending ? <Loader /> : "Submit"}
                            </Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>

            <Toast
                open={showSuccessSnackbar}
                onClose={() => setShowSuccessSnackbar(false)}
                severity="success"
                message="Thanks for your review!"
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
