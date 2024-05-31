import { bodyFont } from "@app/pages/_app";
import { CurrencyRupeeRounded } from "@mui/icons-material";
import { Stack, Box, Typography, Chip } from "@mui/material";
import Image from "next/image";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import Face4RoundedIcon from "@mui/icons-material/Face4Rounded";
import FaceRoundedIcon from "@mui/icons-material/FaceRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import { Order } from "@app/services/orders";
import { AddReview } from "./AddReview";
import { z } from "zod";
import { ReviewSchema } from "@app/services/reviews";

type Props = {
    order: Order;
    review: undefined | z.infer<typeof ReviewSchema>;
};

export function OrderCard({ order, review }: Props) {
    const { camp, campOccupancy, paymentStatus, bookingStatus } = order;

    return (
        <Stack
            direction={{ sm: "column", md: "row" }}
            gap="16px"
            width="100%"
            border="1px solid"
            borderColor="grey.200"
            borderRadius="24px"
            p="12px"
        >
            <Box
                sx={{
                    position: "relative",
                    width: { sm: "100%", md: "400px" },
                    minWidth: { sm: "100%", md: "400px" },
                    height: "360px",
                }}
            >
                <Image
                    src={camp.images[0].image}
                    alt={camp.name}
                    layout="fill"
                    style={{ objectFit: "cover", borderRadius: "16px" }}
                />
            </Box>

            <Stack gap="12px">
                <Typography
                    variant="h4"
                    sx={{
                        fontSize: "1.5rem",
                        fontFamily: bodyFont.style.fontFamily,
                        fontWeight: "600",
                    }}
                >
                    {camp.name}
                </Typography>

                <Typography variant="body2">{camp.about}</Typography>

                <Stack gap="8px" direction="row">
                    <Chip
                        icon={<TodayRoundedIcon fontSize="small" />}
                        label={`Check in: ${formatToDate(campOccupancy.checkIn)}`}
                        variant="outlined"
                        sx={{ fontFamily: bodyFont.style.fontFamily }}
                    />
                    <Chip
                        icon={<TodayRoundedIcon fontSize="small" />}
                        label={`Check out: ${formatToDate(campOccupancy.checkOut)}`}
                        variant="outlined"
                        sx={{ fontFamily: bodyFont.style.fontFamily }}
                    />
                </Stack>

                <Stack gap="8px" direction="row">
                    <Chip
                        icon={<Face4RoundedIcon fontSize="small" />}
                        label={`Adults: ${campOccupancy.adultGuestsCount}`}
                        variant="outlined"
                        sx={{ fontFamily: bodyFont.style.fontFamily }}
                    />
                    <Chip
                        icon={<FaceRoundedIcon fontSize="small" />}
                        label={`Children: ${campOccupancy.childGuestsCount}`}
                        variant="outlined"
                        sx={{ fontFamily: bodyFont.style.fontFamily }}
                    />
                    <Chip
                        icon={<PetsRoundedIcon fontSize="small" />}
                        label={`Pets: ${campOccupancy.petsCount}`}
                        variant="outlined"
                        sx={{ fontFamily: bodyFont.style.fontFamily }}
                    />
                </Stack>

                <Stack gap="8px" direction="row">
                    <Chip
                        icon={<CurrencyRupeeRounded fontSize="small" />}
                        label={`Payment status: ${paymentStatus}`}
                        variant="outlined"
                        sx={{ fontFamily: bodyFont.style.fontFamily }}
                    />
                    <Chip
                        icon={<CurrencyRupeeRounded fontSize="small" />}
                        label={`Booking status: ${bookingStatus}`}
                        variant="outlined"
                        sx={{ fontFamily: bodyFont.style.fontFamily }}
                    />
                </Stack>

                <AddReview review={review} campId={camp.id} />
            </Stack>
        </Stack>
    );
}

function formatToDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
