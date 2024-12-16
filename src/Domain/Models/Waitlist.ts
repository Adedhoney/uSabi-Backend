export interface WaitlistUser {
    userId: string;
    firstName?: string;
    lastName?: string;
    email: string;
    emailVerified?: boolean;
    createdAt: number;
    updatedAt?: number;
}
