export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePic?: string;
};

export type UserFromApiResponse = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_pic?: string;
};

export function transformUser(user: UserFromApiResponse): User {
    return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        profilePic: user.profile_pic,
    };
}
