import { FetchedCamp } from "@app/services/camps";
import { getImagePathForFeature } from "@app/utils/camp";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";

type CampHightlightFeaturesProps = Pick<FetchedCamp, "features">;

export function CampHightlightFeatures(props: CampHightlightFeaturesProps) {
    const { features } = props;

    return (
        <Stack gap="2rem">
            {features.map(function (feature): React.JSX.Element {
                return (
                    <Stack
                        key={feature.id.toString()}
                        direction="row"
                        width="100%"
                        gap="1rem"
                    >
                        <Image
                            src={getImagePathForFeature(feature.feature.label)}
                            alt={feature.feature.label}
                            style={{ objectFit: "contain" }}
                            width={46}
                            height={46}
                        />

                        <Stack width="100%">
                            <Typography
                                fontSize="18px"
                                fontWeight="bold"
                                color="gray.900"
                            >
                                {feature.feature.label}
                            </Typography>
                            <Typography color="gray.600">
                                {feature.feature.description}
                            </Typography>
                        </Stack>
                    </Stack>
                );
            })}
        </Stack>
    );
}
