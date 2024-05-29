import { useLikeCamp } from "@app/hooks/like-camps";
import { type FetchedCamp } from "@app/services/camps";
import { IconButton } from "@mui/material";
import Image from "next/image";
import { useState, MouseEvent, useEffect } from "react";

type Props = {
    campId: FetchedCamp["id"];
};

export function LikeButton({ campId }: Props) {
    const { likeCamp, getCamps } = useLikeCamp();
    const [isLiked, setIsLiked] = useState(false);

    function like(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        likeCamp.like(campId);
    }

    useEffect(
        function () {
            console.log("hiii", getCamps, campId);
            setIsLiked(getCamps.camps.some((camp) => camp.id === campId));
        },
        [getCamps.camps]
    );

    return (
        <IconButton
            onClick={like}
            aria-label="like camp"
            sx={{
                borderRadius: "50%",
                zIndex: 3,
                position: "absolute",
                top: "1rem",
                right: "1rem",
                bgcolor: isLiked
                    ? "rgba(193, 79, 79, 0.15)"
                    : "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(4px)",
                "&:hover": {
                    bgcolor: isLiked
                        ? "rgba(193, 79, 79, 0.25)"
                        : "rgba(255, 255, 255, 0.2)",
                },
                "&:active": {
                    bgcolor: isLiked
                        ? "rgba(193, 79, 79, 0.35)"
                        : "rgba(255, 255, 255, 0.3)",
                },
                "& .MuiTouchRipple-root .MuiTouchRipple-child": {
                    borderRadius: "50%",
                },
            }}
        >
            <Image
                src={
                    isLiked
                        ? "/icons/heart-light-red.png"
                        : "/icons/heart-light.png"
                }
                alt="Like camp"
                width={20}
                height={20}
            />
        </IconButton>
    );
}
