import { keyframes, styled } from "@mui/material";
import React from "react";

const bounce = keyframes`
  to {
    opacity: 0.1;
    transform: translateY(-10px);
  }
`;

const BouncingLoader = styled("div")`
    display: flex;
    justify-content: center;
`;

const Bounce = styled("div")`
    width: 12px;
    height: 12px;
    margin: 3px 4px;
    border-radius: 50%;
    opacity: 1;
    animation: ${bounce} 0.6s infinite alternate;

    &:nth-of-type(2) {
        animation-delay: 0.2s;
    }

    &:nth-of-type(3) {
        animation-delay: 0.4s;
    }
`;

type Props = {
    variant?: "primary" | "neutral";
};

function getBgColor(variant: Props["variant"]) {
    switch (variant) {
        case "primary":
            return "primary.700";
        case "neutral":
            return "grey.500";
        default:
            return "primary.700";
    }
}

export function Loader(props: Props): React.JSX.Element {
    const bgColor = getBgColor(props.variant);

    return (
        <BouncingLoader data-testid="loader">
            <Bounce sx={{ bgcolor: bgColor }} />
            <Bounce sx={{ bgcolor: bgColor }} />
            <Bounce sx={{ bgcolor: bgColor }} />
        </BouncingLoader>
    );
}
