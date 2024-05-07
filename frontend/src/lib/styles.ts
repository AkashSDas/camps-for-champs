import { headingFont, bodyFont } from "@app/pages/_app";
import { createTheme } from "@mui/material";

const greyColors = {
    "50": "#fdfdfd",
    "100": "#f6f6f6",
    "200": "#f1f1f1",
    "300": "#dcdddc",
    "400": "#c5c6c4",
    "500": "#969895",
    "600": "#676a66",
    "700": "#545853",
    "800": "#383c37",
    "900": "#313530",
};

export const theme = createTheme({
    components: {
        MuiSkeleton: {
            defaultProps: {
                animation: "pulse",
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    fontFamily: bodyFont.style.fontFamily,
                    fontWeight: 500,
                },
            },
        },
        MuiDialogContentText: {
            styleOverrides: {
                root: {
                    color: greyColors["700"],
                },
            },
        },
        MuiTextField: {
            variants: [
                {
                    props: { variant: "outlined" },
                    style: {
                        "& .MuiFormLabel-root": {
                            fontFamily: bodyFont.style.fontFamily,
                            fontWeight: 400,
                            color: greyColors["600"],
                            // "&[data-shrink='true']": {
                            //     color: greyColors["600"],
                            // },
                        },
                        "& .MuiOutlinedInput-root": {
                            "& input": {
                                fontFamily: bodyFont.style.fontFamily,
                                "&::placeholder": {
                                    fontFamily: bodyFont.style.fontFamily,
                                },
                            },
                            "& fieldset": {
                                borderRadius: "12px",
                                border: "1.5px solid",
                                borderColor: greyColors["300"],
                                fontFamily: bodyFont.style.fontFamily,
                            },
                        },
                        "& .MuiFormHelperText-root": {
                            fontFamily: bodyFont.style.fontFamily,
                            fontWeight: 500,
                        },
                    },
                },
            ],
        },
        MuiTypography: {
            variants: [
                {
                    props: { variant: "h1" },
                    style: {
                        fontFamily: headingFont.style.fontFamily,
                        color: greyColors["900"],
                    },
                },
                {
                    props: { variant: "h2" },
                    style: {
                        fontFamily: headingFont.style.fontFamily,
                        fontSize: "39.06px",
                        color: greyColors["900"],
                    },
                },
                {
                    props: { variant: "h3" },
                    style: {
                        fontFamily: headingFont.style.fontFamily,
                        color: greyColors["900"],
                    },
                },
                {
                    props: { variant: "h4" },
                    style: {
                        fontFamily: headingFont.style.fontFamily,
                        color: greyColors["900"],
                    },
                },
                {
                    props: { variant: "h5" },
                    style: {
                        fontFamily: headingFont.style.fontFamily,
                        color: greyColors["900"],
                    },
                },
                {
                    props: { variant: "body1" },
                    style: { fontFamily: bodyFont.style.fontFamily },
                },
                {
                    props: { variant: "body2" },
                    style: { fontFamily: bodyFont.style.fontFamily },
                },
                {
                    props: { variant: "subtitle1" },
                    style: { fontFamily: bodyFont.style.fontFamily },
                },
                {
                    props: { variant: "subtitle2" },
                    style: { fontFamily: bodyFont.style.fontFamily },
                },
            ],
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: "10px",
                    "& .MuiTouchRipple-root .MuiTouchRipple-child": {
                        borderRadius: "10px",
                    },
                },
            },
        },
        MuiButton: {
            variants: [
                {
                    props: { variant: "text" },
                    style: {
                        fontFamily: "inherit",
                        color: greyColors["700"],
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 500,
                        borderRadius: "10px",
                        paddingInline: "20px",
                        height: "44px",
                    },
                },
                {
                    props: { variant: "contained" },
                    style: {
                        fontFamily: headingFont.style.fontFamily,
                        color: "white",
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 500,
                        bgcolor: "primary.500",
                        "&:hover": {
                            bgcolor: "primary.600",
                        },
                        borderRadius: "10px",
                        paddingInline: "20px",
                        height: "44px",
                    },
                },
                {
                    props: { variant: "outlined" },
                    style: {
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: "medium",
                        borderRadius: "10px",
                        paddingInline: "20px",
                        height: "44px",
                        color: greyColors[700],
                        border: "1.5px solid",
                        "&:hover": {
                            border: "1.5px solid",
                        },
                    },
                },
            ],
        },
    },
    palette: {
        action: {
            active: "#495e40",
            hover: "#f1f1f1",
            selected: "#f1f1f1",
            disabled: "#676a66",
            disabledBackground: "#dcdddc",
            focus: "#495e40",
            hoverOpacity: 0.08,
            selectedOpacity: 0.08,
            disabledOpacity: 0.38,
            focusOpacity: 0.12,
        },
        text: {
            primary: "#545853",
            secondary: "#495e40",
            disabled: "#676a66",
        },
        divider: "#dcdddc",
        common: {
            black: "#151a14",
            white: "#ffffff",
        },
        mode: "light",
        grey: greyColors,
        primary: {
            "50": "#edefec",
            "100": "#c7cdc4",
            "200": "#abb5a7",
            "300": "#85937f",
            "400": "#6d7e66",
            "500": "#495e40",
            "600": "#42563a",
            "700": "#34432d",
            "800": "#283423",
            "900": "#1f271b",
        },
        info: {
            "50": "#f0f4f6",
            "100": "#d1dde3",
            "200": "#bbccd6",
            "300": "#9cb5c3",
            "400": "#89a6b7",
            "500": "#6b90a5",
            "600": "#618396",
            "700": "#4c6675",
            "800": "#3b4f5b",
            "900": "#2d3c45",
        },
        success: {
            "50": "#f2f6f0",
            "100": "#d6e4d1",
            "200": "#c3d7bb",
            "300": "#a7c49d",
            "400": "#96b989",
            "500": "#7ca76c",
            "600": "#719862",
            "700": "#58774d",
            "800": "#445c3b",
            "900": "#34462d",
        },
        error: {
            "50": "#f6f0f0",
            "100": "#e4d1d2",
            "200": "#d7bbbc",
            "300": "#c49d9d",
            "400": "#b9898a",
            "500": "#a76c6d",
            "600": "#986263",
            "700": "#774d4d",
            "800": "#5c3b3c",
            "900": "#462d2e",
            main: "#DB4D4F",
        },
    },
});
