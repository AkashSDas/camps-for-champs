import { confirmCampBooking } from "@app/services/orders";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function useConfirmBooking() {
    const router = useRouter();
    const [success, setSuccess] = useState<null | "success" | "failed">(null);
    const mutation = useMutation({
        async mutationFn({
            campId,
            orderId,
        }: {
            campId: number;
            orderId: number;
        }) {
            return confirmCampBooking(campId, orderId);
        },
        onSuccess(data, variables, context) {
            router.replace("/orders");
            setSuccess("success");
        },
        onError(error, variables, context) {
            setSuccess("failed");
        },
    });

    useEffect(
        function confirm() {
            if (router.isReady) {
                const { orderId, campId } = router.query;
                if (typeof orderId === "string" && typeof campId === "string") {
                    mutation.mutateAsync({
                        orderId: parseInt(orderId),
                        campId: parseInt(campId),
                    });
                }
            }
        },
        [router.isReady]
    );

    return { success, close: () => setSuccess(null) };
}
