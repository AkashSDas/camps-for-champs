import { IconButton } from "@mui/material";
import Image from "next/image";

export function LikeButton() {
    return (
        <IconButton
            aria-label="like camp"
            sx={{
                borderRadius: "50%",
                zIndex: 3,
                position: "absolute",
                top: "1rem",
                right: "1rem",
                bgcolor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(4px)",
                "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                },
                "&:active": {
                    bgcolor: "rgba(255, 255, 255, 0.3)",
                },
                "& .MuiTouchRipple-root .MuiTouchRipple-child": {
                    borderRadius: "50%",
                },
            }}
        >
            <Image
                src="/icons/heart-light.png"
                alt="Like camp"
                width={20}
                height={20}
            />
        </IconButton>
    );
}
