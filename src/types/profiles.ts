export enum userTypeEnum{
    "guest", "member", "admin"
}

export interface Profile {
    supaId: string;
    projectId: string | null;
    userType: string;
}

export interface AccountData {
  firstName: string;
  lastName: string;
}


