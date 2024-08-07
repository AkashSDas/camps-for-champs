import { useLikeCamp } from "@app/hooks/like-camps";
import { bodyFont, headingFont } from "@app/pages/_app";
import { FetchedCamp } from "@app/services/camps";
import { Button, Divider, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useEffect, useState } from "react";

type Props = Pick<
    FetchedCamp,
    "name" | "overallRating" | "totalReviews" | "address" | "id"
>;

export function InfoHeader(props: Props) {
    const { name, overallRating, totalReviews, address, id } = props;

    return (
        <Stack gap={0} display={{ xs: "none", sm: "flex" }}>
            <Typography
                variant="h1"
                fontFamily={bodyFont.style.fontFamily}
                fontSize="30px"
                fontWeight="bold"
                mb={{ xs: "0.5rem", md: "1rem" }}
            >
                {name}
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
                        fontFamily={headingFont.style.fontFamily}
                    >
                        {overallRating}%
                    </Typography>
                </Stack>

                <Divider orientation="vertical" flexItem />
                <Typography variant="body1" fontWeight="medium">
                    {totalReviews} reviews
                </Typography>
                <Divider orientation="vertical" flexItem />
                <Typography variant="body1" fontWeight="medium">
                    {address}
                </Typography>
            </Stack>

            <ActionButtonGroup campId={id} />
        </Stack>
    );
}

function ActionButtonGroup({ campId }: { campId: number }) {
    const { likeCamp, getCamps } = useLikeCamp();
    const [isLiked, setIsLiked] = useState(false);

    function like(e: MouseEvent) {
        e.stopPropagation();
        likeCamp.like(campId);
    }

    useEffect(
        function () {
            setIsLiked(getCamps.camps.some((camp) => camp.id === campId));
        },
        [getCamps.camps]
    );

    return (
        <Stack
            direction="row"
            gap="1rem"
            alignItems="center"
            mt={{ xs: "1rem", md: "2rem" }}
        >
            <Button
                variant="contained"
                disableElevation
                LinkComponent={Link}
                target="_blank"
                href={`/camps/${campId}/checkout`}
                startIcon={
                    <Image
                        src="/figmoji/tent-with-tree.png"
                        alt="Book camp"
                        width={20}
                        height={20}
                    />
                }
            >
                Book
            </Button>

            <Button
                variant="outlined"
                disableElevation
                sx={{ fontWeight: 600 }}
                startIcon={
                    <Image
                        src="/icons/share.png"
                        alt="Share camp with others"
                        width={20}
                        height={20}
                    />
                }
            >
                Share
            </Button>

            <Button
                variant="outlined"
                disableElevation
                sx={{
                    fontWeight: 600,
                    bgcolor: isLiked ? "primary.100" : "white",
                }}
                onClick={like}
                startIcon={
                    <Image
                        src="/icons/heart.png"
                        alt="Save camp"
                        width={20}
                        height={20}
                    />
                }
            >
                Save
            </Button>
        </Stack>
    );
}
