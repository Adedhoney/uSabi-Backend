export interface OTP {
    id?: number;
    email: string;
    otp: string;
    expiresAt: number;
    wrongTrials: number;
    status: OTPStatus;
}

export enum OTPStatus {
    UNUSED = 0,
    USED = 1,
}
