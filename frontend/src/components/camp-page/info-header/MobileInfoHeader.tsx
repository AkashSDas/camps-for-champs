import { bodyFont } from "@app/pages/_app";
import { FetchedCamp } from "@app/services/camps";
import { Stack, Typography, Divider } from "@mui/material";
import Image from "next/image";

type MobileInfoHeaderProps = Pick<
    FetchedCamp,
    "name" | "overallRating" | "totalReviews" | "address"
>;

export function MobileInfoHeader(props: MobileInfoHeaderProps) {
    const { name, overallRating, totalReviews, address } = props;

    return (
        <Stack gap="8px" display={{ xs: "flex", sm: "none" }}>
            <Typography
                variant="h1"
                fontFamily={bodyFont.style.fontFamily}
                fontSize="24px"
                fontWeight="bold"
            >
                {name}
            </Typography>

            <Typography variant="body1" fontWeight="medium">
                {address}
            </Typography>

            <Stack direction="row" gap="1rem">
                <Stack direction="row" gap="0.5rem" alignItems="center">
                    <Image
                        src="/icons/like.png"
                        alt="Overall camp rating percentage"
                        width={20}
                        height={20}
                    />
                    <Typography
                        variant="body1"
                        color="grey.800"
                        fontFamily={bodyFont.style.fontFamily}
                    >
                        {overallRating}%
                    </Typography>
                </Stack>

                <Divider orientation="vertical" flexItem />
                <Typography variant="body1" fontWeight="medium">
                    {totalReviews} reviews
                </Typography>
            </Stack>
        </Stack>
    );
}
