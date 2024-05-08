import { bodyFont } from "@app/pages/_app";
import { FetchedCamp } from "@app/services/camps";
import { Box, Button, Grid, Stack, styled } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

const DUMMY_IMG =
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const ImageButton = styled(Button)({
    position: "relative",
    width: "100%",
    height: "100%",
    transition: "filter 0.3s ease-in-out",
    "& > img": {
        transition: "filter 0.3s ease-in-out",
    },
    "&:hover": {
        "& > img": {
            filter: "brightness(0.85)",
        },
    },
});

type Props = Pick<FetchedCamp, "images">;

export function ImageGallery({ images }: Props) {
    const router = useRouter();

    function pushToImagesPage() {
        router.push(`/camps/${router.query.campId}/images`);
    }

    return (
        <Grid
            container
            spacing={1}
            height={{ xs: "250px", md: "450px" }}
            display={{ xs: "none", sm: "flex" }}
            position="relative"
        >
            <Button
                variant="contained"
                sx={{
                    bgcolor: "white",
                    color: "black",
                    fontFamily: bodyFont.style.fontFamily,
                    fontSize: "1rem",
                    position: "absolute",
                    bottom: { xs: "0.5rem", md: "1rem" },
                    right: { xs: "0.5rem", md: "1rem" },
                    zIndex: 1,
                    "&:hover": { bgcolor: "grey.200" },
                }}
                onClick={pushToImagesPage}
            >
                View {images[0].totalImages} photos
            </Button>

            <Grid item xs={6}>
                <Box
                    component={ImageButton}
                    disableRipple
                    onClick={pushToImagesPage}
                >
                    <Image
                        src={DUMMY_IMG}
                        alt={images[0].altText ?? "Camp image"}
                        style={{
                            borderTopLeftRadius: "18px",
                            borderBottomLeftRadius: "18px",
                            objectFit: "cover",
                        }}
                        fill
                    />
                </Box>
            </Grid>

            <Grid item xs={6}>
                <Grid
                    container
                    spacing={1}
                    height={{ xs: "250px", md: "450px" }}
                >
                    <Grid item xs={6}>
                        <Box
                            component={ImageButton}
                            disableRipple
                            onClick={pushToImagesPage}
                        >
                            <Image
                                src={DUMMY_IMG}
                                alt={images[1].altText ?? "Camp image"}
                                style={{ objectFit: "cover" }}
                                fill
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={6}>
                        <Box
                            component={ImageButton}
                            disableRipple
                            onClick={pushToImagesPage}
                        >
                            <Image
                                src={DUMMY_IMG}
                                alt={images[1].altText ?? "Camp image"}
                                style={{
                                    objectFit: "cover",
                                    borderTopRightRadius: "18px",
                                }}
                                fill
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={6}>
                        <Box
                            component={ImageButton}
                            disableRipple
                            onClick={pushToImagesPage}
                        >
                            <Image
                                src={DUMMY_IMG}
                                alt={images[3].altText ?? "Camp image"}
                                style={{ objectFit: "cover" }}
                                fill
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={6}>
                        <Box
                            component={ImageButton}
                            disableRipple
                            onClick={pushToImagesPage}
                        >
                            <Image
                                src={DUMMY_IMG}
                                alt={images[4].altText ?? "Camp image"}
                                style={{
                                    borderBottomRightRadius: "18px",
                                    objectFit: "cover",
                                }}
                                fill
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
