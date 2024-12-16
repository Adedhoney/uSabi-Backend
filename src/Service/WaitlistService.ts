import { CustomError } from "@application/error";
import { generateRandomId, generateRandomOTP, getCurrentTimeStamp, StatusCode } from "@application/utilities";
import { OTPStatus } from "@domain/Models";
import { WaitlistUser } from "@domain/Models/Waitlist";
import { IOTPRepository } from "@domain/Repositories";
import { IWaitlistRepository } from "@domain/Repositories/WaitlistRepository";
import { IAccountNotification } from "Handlers/Notification";

export interface IWaitlistService {
    addToWaitlist(user: Omit<WaitlistUser, 'userId' | 'emailVerified'>): Promise<WaitlistUser>;
    verifyWaitlistUserEmail(email: string, otp: string): Promise<WaitlistUser>;
    getWaitlistUsers(): Promise<WaitlistUser[]>;
}

export class WaitlistService implements IWaitlistService {
    constructor(
	private waitlistRepo: IWaitlistRepository,
	private otpRepo: IOTPRepository,
	private acctNotif: IAccountNotification,
    ) {}

    async addToWaitlist(user: Omit<WaitlistUser, 'userId' | 'emailVerified' | 'createdAt'>): Promise<WaitlistUser> {
	const existingUser = await this.waitlistRepo.getWaitlistUserByEmail(user.email);
	if (existingUser) {
            throw new CustomError('User is already in the waitlist', StatusCode.CONFLICT);
	}
	const date = getCurrentTimeStamp();
	const userWaitlist = {
	    ...user,
            userId: generateRandomId(),
	    emailVerified: false,
	    createdAt: date,
	}
	const otp = generateRandomOTP();
	await this.otpRepo.saveOTP({
            email: userWaitlist.email,
	    otp,
	    expiresAt: date + 1200,
	    wrongTrials: 0,
	    status: OTPStatus.UNUSED,
	});
	await this.acctNotif.verificationEmail(userWaitlist.email, otp, userWaitlist.firstName);
        return await this.waitlistRepo.addUser(userWaitlist);
    }

    async verifyWaitlistUserEmail(email: string, otp: string): Promise<WaitlistUser> {
	const date = getCurrentTimeStamp();
        const user = await this.waitlistRepo.getWaitlistUserByEmail(email);
	if (!user) {
            throw new CustomError('User not founc in waitlist', StatusCode.NOT_FOUND);
	}
	if (user.emailVerified) {
            throw new CustomError('User already verified', StatusCode.BAD_REQUEST);
	}
	const otpDetails = await this.otpRepo.getOTP(email, otp);
	if (!otpDetails || otpDetails.expiresAt < date || otpDetails.status === OTPStatus.USED) {
            throw new CustomError('Invalid or expired OTP', StatusCode.BAD_REQUEST);
	}
	await this.otpRepo.useOTP(email, otp);
	await this.waitlistRepo.verifyWaitlistEmail(email, date);
	return user;
    }

    async getWaitlistUsers(): Promise<WaitlistUser[]> {
        return await this.waitlistRepo.getWaitlist();
    }
}
