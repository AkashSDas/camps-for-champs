import { Remove, Add } from "@mui/icons-material";
import { Stack, Typography, IconButton } from "@mui/material";

type Props = {
    label: string;
    description?: string;
    onIncrement: () => void;
    onDecrement: () => void;
    count: number;
};

export function GuestsCounter(props: Props): React.JSX.Element {
    const { label, description, onIncrement, onDecrement, count } = props;

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <Stack>
                <Typography variant="body1" fontWeight="500">
                    {label}
                </Typography>
                {description ? (
                    <Typography variant="body2">{description}</Typography>
                ) : null}
            </Stack>

            <Stack direction="row" alignItems="center" gap="1rem">
                <IconButton
                    size="small"
                    aria-label="Remove"
                    sx={{
                        border: "1.5px solid",
                        borderColor: "grey.400",
                        "&:disabled": {
                            color: "grey.400",
                        },
                    }}
                    disabled={count === 0}
                    onClick={onDecrement}
                >
                    <Remove />
                </IconButton>

                <Typography variant="body1" fontWeight="500" width="16px">
                    {count}
                </Typography>

                <IconButton
                    size="small"
                    aria-label="Add"
                    sx={{
                        border: "1.5px solid",
                        borderColor: "grey.400",
                        "&:disabled": {
                            color: "grey.400",
                        },
                    }}
                    onClick={onIncrement}
                    disabled={count === 10}
                >
                    <Add />
                </IconButton>
            </Stack>
        </Stack>
    );
}
