import { User } from '@domain/Models';

export interface SignUpDTO {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface GoogleSignInDTO {
    accessToken: string;
}

export interface LogInDTO {
    email: string;
    password: string;
}

export interface LogInResponse {
    token: string;
    user: User;
}

export interface UpdateInfoDTO {
    firstName?: string;
    lastName?: string;
    DOB: number;
}
export interface UpdatePassWordDTO {
    password: string;
}

export interface VerifyOtpDTO {
    email: string;
    otp: string;
}
export interface ResetPasswordDTO {
    otpToken: string;
    newPassword: string;
}

export interface GoogleUserDTO {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
}
