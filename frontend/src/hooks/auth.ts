import { refreshToken } from "@app/services/auth";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
    const { data, status } = useQuery({
        queryKey: ["user"],
        queryFn: refreshToken,
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
        status,
    };
}
