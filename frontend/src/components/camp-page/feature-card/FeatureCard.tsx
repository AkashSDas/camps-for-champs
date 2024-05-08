import { FetchedCamp } from "@app/services/camps";
import { getImagePathForFeature } from "@app/utils/camp";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";

type FeatureCardProps = {
    feature: FetchedCamp["features"][number];
};

export function FeatureCard(props: FeatureCardProps) {
    const { feature } = props;

    return (
        <Stack
            direction="row"
            alignItems="center"
            gap="0.5rem"
            bgcolor="grey.100"
            borderRadius="20px"
            height="44px"
            px="20px"
        >
            <Image
                src={getImagePathForFeature(feature.feature.label)}
                alt={feature.feature.label}
                style={{ objectFit: "contain" }}
                width={24}
                height={24}
            />

            <Typography>{feature.feature.label}</Typography>
        </Stack>
    );
}
