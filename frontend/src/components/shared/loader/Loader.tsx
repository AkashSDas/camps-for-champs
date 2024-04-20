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
    background-color: #a3a1a1;
    opacity: 1;
    animation: ${bounce} 0.6s infinite alternate;

    &:nth-child(2) {
        animation-delay: 0.2s;
    }

    &:nth-child(3) {
        animation-delay: 0.4s;
    }
`;

export function Loader(): React.JSX.Element {
    return (
        <BouncingLoader>
            <Bounce />
            <Bounce />
            <Bounce />
        </BouncingLoader>
    );
}
