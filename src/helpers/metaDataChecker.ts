import { User } from "@supabase/supabase-js";

export function isProfileComplete(user: User) {
    return (
        user.user_metadata &&
        user.user_metadata.memberType &&
        user.user_metadata.fullName
    );
}

export function isUserConfirmed(user: User | undefined) {
    return (
        user &&
        user.user_metadata &&
        user.user_metadata.confirmed
    );
}