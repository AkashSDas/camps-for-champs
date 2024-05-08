import { ImageGallery } from "@app/components/camp-page/image-gallery/ImageGallery";
import { InfoHeader } from "@app/components/camp-page/info-header/InfoHeader";
import { Navbar } from "@app/components/shared/navbar/Navbar";
import { getCamp } from "@app/services/camps";
import { Box } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps = async function (context) {
    const { campId } = context.query;
    if (typeof campId !== "string" || isNaN(parseInt(campId, 10))) {
        return { notFound: true };
    }

    const res = await getCamp(parseInt(campId, 10));
    if (!res.success || res.camp == null) {
        return { notFound: true };
    }

    return {
        props: { camp: res.camp },
    };
} satisfies GetServerSideProps;

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function CampInfo(props: Props) {
    const { camp } = props;
    const { name, address, overallRating, totalReviews, images } = camp;

    return (
        <Box>
            <Navbar />

            <Box mt={{ xs: "96px", md: "144px" }} mb="2rem">
                <Box px={{ xs: "1rem", md: "4rem" }} mb="2rem">
                    <InfoHeader
                        name={name}
                        address={address}
                        overallRating={overallRating}
                        totalReviews={totalReviews}
                    />
                </Box>

                <Box px={{ xs: "1rem", md: "4rem" }}>
                    <ImageGallery images={images} />
                </Box>
            </Box>
        </Box>
    );
}
