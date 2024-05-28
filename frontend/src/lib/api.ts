import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    timeout: 3000, // 3 seconds
    timeoutErrorMessage: "Request timed out",
});

type ApiResponse<T> = {
    status: number;
    data: T | null;
    error: null | { message: string };
    success: boolean;
};

export async function fetchFromAPI<T>(
    url: string,
    opts?: AxiosRequestConfig,
    useAuth = false
): Promise<ApiResponse<T>> {
    try {
        const res = await axiosInstance<T>(url, {
            ...opts,
            headers: {
                ...opts?.headers,
                ...(useAuth
                    ? {
                          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                      }
                    : {}),
            },
        });

        return {
            status: res.status,
            data: res.data,
            error: null,
            success: res.status < 300,
        };
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.response) {
                return {
                    status: e.response.status,
                    data: e.response.data,
                    error: null,
                    success: e.response.status < 300,
                };
            }

            if (e.message == "Network Error") {
                return {
                    status: 500,
                    data: null,
                    error: { message: "Network Error" },
                    success: false,
                };
            }
        }

        console.error(e);
    }

    return {
        status: 500,
        data: null,
        error: { message: "Unknown Error" },
        success: false,
    };
}

export const endpoints = Object.freeze({
    // Auth
    refreshToken: "users/login/refresh/",
    signup: "users/signup/",
    login: "users/login/",
    logout: "users/logout/",
    forgotPasssword: "users/forgot-password/",
    resetPasssword: "users/forgot-password/confirm/",

    // Camps
    searchCamps: "camps/search/",
    getCamp: (campId: number) => `camps/${campId}/`,
    likedCamps: "camps/likes/user/",
    likeCamp: (campId: number) => `camps/${campId}/likes/`,

    // Reviews
    markReviewHelpful: (campId: number, reviewId: number) => {
        return `camps/${campId}/reviews/${reviewId}/mark-helpful/`;
    },
    getCampReviews: (campId: number, searchText: string) => {
        return `camps/${campId}/reviews/?search-text=${searchText}`;
    },
    getCampImages: (campId: number) => `camps/${campId}/images/`,
    getAllCamps: "camps/",

    // Users
    profile: "users/profile/",
});
