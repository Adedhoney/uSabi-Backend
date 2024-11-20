import { IDatabase } from '@infrastructure/Database';
import { OTP, OTPStatus } from '../Models';

export interface IOTPRepository {
    saveOTP(otp: OTP): Promise<void>;
    getOTP(email: string, otp: string): Promise<OTP>;
    useOTP(email: string, otp: string, date: number): Promise<void>;
}

export class OTPRepository implements IOTPRepository {
    constructor(readonly db: IDatabase) {}

    async saveOTP(otp: OTP): Promise<void> {
        await this.db.execute(
            `INSERT INTO otps (email, otp, expiresAt, wrongTrials, status)
            VALUES (?, ?, ?,0, ?)     
            ON DUPLICATE KEY UPDATE
                otp = VALUES(otp),
                expiresAt = VALUES(expiresAt),
                status = VALUES(status)`,
            [otp.email, otp.otp, otp.expiresAt, otp.status],
        );
    }

    async getOTP(email: string, otp: string): Promise<OTP> {
        const otpInfo = await this.db.execute(
            `SELECT * FROM otps
     WHERE email = ? AND otp = ?`,
            [email, otp],
        );
        return otpInfo[0] as OTP;
    }

    async useOTP(email: string, otp: string): Promise<void> {
        await this.db.execute(
            `UPDATE otps SET status = ${OTPStatus.USED}
     WHERE email = ? AND otp = ?`,
            [email, otp],
        );
    }
}
