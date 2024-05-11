import { Navbar } from "@app/components/shared/navbar/Navbar";
import { getAllCamps, getCampImages } from "@app/services/camps";
import { Box, ImageList, ImageListItem } from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";

export const getStaticProps: GetStaticProps = async function ({ params }) {
    if (!params?.campId) return { notFound: true };
    const res = await getCampImages(parseInt(params.campId as string, 10));
    if (!res.success) return { notFound: true };

    return {
        props: {
            images: res.images!,
            camp: res.camp!,
        },
        revalidate: 10,
    };
};

// type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
type StaticPaths = {
    params: { campId: string }; // campId is due to route path
}[];

export const getStaticPaths: GetStaticPaths = async function () {
    const res = await getAllCamps();
    if (!res.success) {
        return { notFound: true, fallback: "blocking", paths: [] };
    }

    return {
        paths: res.camps!.map((camp) => ({
            params: { campId: camp.id.toString() },
        })) as StaticPaths,
        fallback: "blocking",
    };
};

// type Props = InferGetStaticPropsType<typeof getStaticProps>;
type Props = {
    images: NonNullable<Awaited<ReturnType<typeof getCampImages>>["images"]>;
    camp: NonNullable<Awaited<ReturnType<typeof getCampImages>>["camp"]>;
};

export default function CampImages(props: Props) {
    const { images, camp } = props;

    return (
        <Box>
            <Head>
                <title>Images - {camp.name}</title>
            </Head>
            <Navbar />

            <Box
                px={{ xs: "1rem", md: "4rem" }}
                mt={{ xs: "96px", md: "144px" }}
            >
                <ImageList variant="quilted" cols={2} rowHeight={600}>
                    {images.map((img) => {
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
                                            camp?.name ??
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
