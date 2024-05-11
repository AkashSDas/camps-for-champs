import { Navbar } from "@app/components/shared/navbar/Navbar";
import { getAllCamps, getCampImages } from "@app/services/camps";
import { Box, ImageList, ImageListItem, Typography } from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

type StaticPaths = {
    params: { campId: string }; // campId is in the route path
}[];

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.

export const getStaticPaths: GetStaticPaths = async function () {
    const res = await getAllCamps();

    // Get the paths we want to pre-render based on camps/images
    const paths: StaticPaths =
        res.camps?.map((camp) => ({
            params: { campId: camp.id.toString() },
        })) ?? [];

    // We'll pre-render only these paths at build time.
    // { fallback: 'blocking' } will server-render pages
    // on-demand if the path doesn't exist.
    return {
        paths,
        fallback: "blocking",
    };
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export const getStaticProps: GetStaticProps = async function () {
    const campRes = await getAllCamps();
    const campIds = campRes.camps?.map((camp) => camp.id) ?? [];
    const imgsRes = await Promise.all(campIds.map((id) => getCampImages(id)));

    return {
        props: {
            campImagesResponse: imgsRes,
        },

        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 10 seconds
        revalidate: 10,
    };
};

type Props = {
    campImagesResponse: Awaited<ReturnType<typeof getCampImages>>[];
};

export default function CampImages(props: Props) {
    const { campImagesResponse } = props;
    const router = useRouter();
    const campImg = campImagesResponse?.find(
        (img) =>
            img.success &&
            img.camp?.id === parseInt(router.query.campId as string, 10)
    );

    if (!campImg) {
        return (
            <Box>
                <Head>
                    <title>Images - Not Found</title>
                </Head>
                <Navbar />

                <Box
                    px={{ xs: "1rem", md: "4rem" }}
                    mt={{ xs: "96px", md: "144px" }}
                >
                    <Typography variant="body1">
                        No images found for this camp
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            <Head>
                <title>Images - {campImg.camp?.name}</title>
            </Head>
            <Navbar />

            <Box
                px={{ xs: "1rem", md: "4rem" }}
                mt={{ xs: "96px", md: "144px" }}
            >
                <ImageList variant="quilted" cols={2} rowHeight={600}>
                    {(campImg.images ?? []).map((img) => {
                        const row = img.id % 2 === 0 ? 1 : 2;

                        return (
                            <ImageListItem key={img.id} rows={row}>
                                <Box
                                    position="relative"
                                    width="100%"
                                    height="100%"
                                >
                                    <Image
                                        // src={img.image}
                                        src={
                                            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        }
                                        alt={
                                            img.altText ??
                                            campImg.camp?.name ??
                                            "Camp image"
                                        }
                                        loading="lazy"
                                        style={{ objectFit: "cover" }}
                                        layout="fill"
                                    />
                                </Box>
                            </ImageListItem>
                        );
                    })}
                </ImageList>
            </Box>
        </Box>
    );
}
