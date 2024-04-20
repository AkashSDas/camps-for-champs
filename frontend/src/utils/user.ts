export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
};

export type UserFromApiResponse = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
};

export function transformUser(user: UserFromApiResponse): User {
    return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
    };
}
