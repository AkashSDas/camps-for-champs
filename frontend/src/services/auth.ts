import { type LoginSchemaType } from "@app/components/auth/login-modal/LoginModal";
import { type SignUpSchemaType } from "@app/components/auth/signup-modal/SignupModal";
import { endpoints, fetchFromAPI } from "@app/lib/api";
import { transformUser, type UserFromApiResponse } from "@app/utils/user";

export async function refreshToken() {
    type SuccessResponse = { access: string };
    type ErrorResponse = { detail: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.refreshToken,
        { method: "POST" }
    );
    const { data, status } = res;

    if (status === 200 && data != null && "access" in data) {
        return {
            success: true,
            message: "Successfully refreshed access token",
            accessToken: data.access,
        };
    } else if (status == 401 && data != null && "detail" in data) {
        return { success: false, message: data.detail };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function signup(payload: SignUpSchemaType) {
    type SuccessResponse = {
        user: UserFromApiResponse;
        access: string;
        message: string;
    };
    type ErrorResponse = { message: string } | { email: string[] };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.signup,
        {
            method: "POST",
            data: {
                email: payload.email,
                password: payload.password,
                first_name: payload.firstName,
                last_name: payload.lastName,
            },
        }
    );
    const { data, status } = res;

    if (status == 201 && data != null && "user" in data) {
        data;
        return {
            success: true,
            message: "Account created successfully",
            user: transformUser(data.user),
            accessToken: data.access,
        };
    } else if (status == 400 && data != null) {
        if ("message" in data) {
            return { success: false, message: data.message };
        } else if ("email" in data && Array.isArray(data.email)) {
            // const err = data.email[0] as string
            return { success: false, message: "Email already used" };
        }
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function login(payload: LoginSchemaType) {
    type SuccessResponse = { user: UserFromApiResponse; access: string };
    type ErrorResponse = { detail: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.login,
        { method: "POST", data: payload }
    );
    const { data, status } = res;

    if (status == 200 && data != null && "user" in data) {
        data;
        return {
            success: true,
            message: "Logged in",
            user: transformUser(data.user),
            accessToken: data.access,
        };
    } else if (
        status == 401 &&
        data != null &&
        "detail" in data &&
        typeof data.detail === "string"
    ) {
        return { success: false, message: data.detail };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}
