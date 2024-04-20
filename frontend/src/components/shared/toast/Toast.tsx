import {
    Snackbar,
    Slide,
    Alert,
    SnackbarProps,
    AlertProps,
} from "@mui/material";

type Props = NonNullable<
    Pick<SnackbarProps, "open" | "onClose"> & Pick<AlertProps, "severity">
> & {
    message: string;
};

export function Toast(props: Props): React.JSX.Element {
    return (
        <Snackbar
            TransitionComponent={Slide}
            open={props.open}
            autoHideDuration={6000}
            onClose={props.onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert severity={props.severity} elevation={2}>
                {props.message}
            </Alert>
        </Snackbar>
    );
}
