import { fetchFromAPI } from "@app/lib/api";
import { refreshToken } from "@app/services/auth";
import { UserFromApiResponse, transformUser } from "@app/utils/user";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
    const { data, status } = useQuery({
        queryKey: ["user"],
        async queryFn() {
            const { accessToken } = await refreshToken();
            if (!accessToken) {
                localStorage.removeItem("accessToken");
                return { user: null, accessToken: null };
            }

            const res = await fetchFromAPI<UserFromApiResponse>("users/me/", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (res.success && res.data) {
                localStorage.setItem("accessToken", accessToken);
                return { user: transformUser(res.data), accessToken };
            }

            localStorage.removeItem("accessToken");
            return { user: null, accessToken: null };
        },
        retry: false,
        refetchOnWindowFocus: false,
        refetchInterval: 4.5 * 60 * 1000, // 4.5 minutes
        retryDelay(failureCount, error) {
            if (error.message == "Network Error") {
                return 0;
            }

            return Math.min(2 ** failureCount * 1000, 30 * 1000);
        },
    });

    return {
        isLoggedIn: !!data?.user && !!data?.accessToken,
        user: data?.user,
        accessToken: data?.accessToken,
        isPending: status === "pending",
    };
}
