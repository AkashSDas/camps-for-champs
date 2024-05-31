import { CampCheckout } from "@app/components/camp-checkout/CampCheckout";
import { Navbar } from "@app/components/shared/navbar/Navbar";
import { Box, Divider, Grid, Typography } from "@mui/material";
import Head from "next/head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getCamp } from "@app/services/camps";

export const getServerSideProps = async function (context) {
    const { res } = context;
    res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate"); // 1 second

    const { campId } = context.query;
    if (typeof campId !== "string" || Number.isNaN(parseInt(campId, 10))) {
        return { notFound: true };
    }

    const result = await getCamp(parseInt(campId, 10));
    if (!result.success || result.camp == null) {
        return { notFound: true };
    }

    return {
        props: { camp: result.camp },
    };
} satisfies GetServerSideProps;

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function CheckoutPage({ camp }: Props): React.JSX.Element {
    const { perNightCost } = camp;

    return (
        <Box position="relative">
            <Head>
                <title>Checkout</title>
            </Head>
            <Navbar />

            <Grid container justifyContent="center">
                <Grid item xs={12} sm={10} md={8} lg={6} mt="144px" px="1rem">
                    <Typography component="h1" variant="h4">
                        Book Camp
                    </Typography>

                    <Divider sx={{ borderColor: "grey.200", my: "32px" }} />

                    <CampCheckout perNightCost={perNightCost} />
                </Grid>
            </Grid>
        </Box>
    );
}
