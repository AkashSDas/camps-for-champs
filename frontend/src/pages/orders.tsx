import { Loader } from "@app/components/shared/loader/Loader";
import { Navbar } from "@app/components/shared/navbar/Navbar";
import { getOrders } from "@app/services/orders";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useUser } from "@app/hooks/auth";
import { OrderCard } from "@app/components/orders/OrderCard";

function useGetAllOrders() {
    const { user } = useUser();
    const { data, isPending } = useQuery({
        queryKey: ["orders", user?.id],
        async queryFn() {
            return getOrders();
        },
        throwOnError: true,
    });

    return { orders: data?.orders ?? [], isPending };
}

export default function LikedCampsPage(): React.JSX.Element {
    const { orders, isPending } = useGetAllOrders();

    return (
        <Box position="relative">
            <Head>
                <title>Orders</title>
            </Head>
            <Navbar />

            <Stack
                alignItems="start"
                justifyContent="start"
                gap="48px"
                mt="118px"
                mx={{ xs: "1rem", sm: "2rem", md: "3rem", lg: "4rem" }}
                sx={(theme) => ({
                    [theme.breakpoints.down("sm")]: { mt: "102px" },
                })}
            >
                <Stack alignItems="start" width="100%" maxWidth="1312px">
                    <Typography variant="h4" mb="2rem">
                        Orders
                    </Typography>

                    <Divider sx={{ borderColor: "grey.200", my: "32px" }} />

                    {isPending ? (
                        <Stack
                            width="100%"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Loader />
                        </Stack>
                    ) : (
                        <Stack gap="24px" width="100%">
                            {orders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </Box>
    );
}
