import { Loader } from "@app/components/shared/loader/Loader";
import { Navbar } from "@app/components/shared/navbar/Navbar";
import { getOrders } from "@app/services/orders";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useUser } from "@app/hooks/auth";
import { OrderCard } from "@app/components/orders/OrderCard";
import { useConfirmBooking } from "@app/hooks/orders";
import { Toast } from "@app/components/shared/toast/Toast";

function useGetAllOrders() {
    const { user } = useUser();
    const { data, isPending } = useQuery({
        queryKey: ["orders", user?.id],
        async queryFn() {
            return getOrders();
        },
        throwOnError: true,
    });

    return {
        orders: data?.orders ?? [],
        reviews: data?.reviews ?? [],
        isPending,
    };
}

export default function OrdersPage(): React.JSX.Element {
    const { orders, isPending, reviews } = useGetAllOrders();
    const { success, close } = useConfirmBooking();

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
                    <Typography variant="h4">Orders</Typography>

                    <Divider sx={{ borderColor: "grey.200", my: "16px" }} />

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
                            {orders.map((order) => {
                                const review = reviews.find(
                                    (r) => r.camp === order.camp.id
                                );

                                return (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        review={review}
                                    />
                                );
                            })}
                        </Stack>
                    )}
                </Stack>
            </Stack>

            <Toast
                open={success === "success"}
                onClose={close}
                severity="success"
                message="Successfully confirmed booking"
            />

            <Toast
                open={success === "failed"}
                onClose={close}
                severity="error"
                message="Failed to confirm booking"
            />
        </Box>
    );
}
