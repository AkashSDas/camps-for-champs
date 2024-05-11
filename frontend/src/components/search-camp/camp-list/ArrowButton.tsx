import styled from "@emotion/styled";
import { IconButton } from "@mui/material";

export const ArrowButton = styled(IconButton)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    bgcolor: "white",
    borderRadius: "50%",
    "&:hover": {
        bgcolor: "grey.200",
    },
    "&:active": {
        bgcolor: "grey.400",
    },
    "& .MuiTouchRipple-root .MuiTouchRipple-child": {
        borderRadius: "50%",
    },
}));
