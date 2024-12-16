import {
    GoogleSignInDTO,
    GoogleUserDTO,
    LogInDTO,
    LogInResponse,
    ResetPasswordDTO,
    SignUpDTO,
    UpdateInfoDTO,
    UpdatePassWordDTO,
    VerifyOtpDTO,
} from '@api/DTO';
import { CustomError } from '@application/error';
import {
    decryptPassword,
    encryptPassword,
    generateAuthToken,
    generateOtpToken,
    generateRandomId,
    generateRandomOTP,
    getCurrentTimeStamp,
    StatusCode,
    verifyOtpToken,
} from '@application/utilities';
import { OTPStatus, User, UserAccountStatus } from '@domain/Models';
import { IAccountRepository, IOTPRepository } from '@domain/Repositories';
import axios from 'axios';
import { IAccountNotification } from 'Handlers/Notification';

export interface IAccountService {
    SignUp(data: SignUpDTO): Promise<void>;
    LogIn(data: LogInDTO): Promise<LogInResponse>;
    VerifyEmail(data: VerifyOtpDTO): Promise<LogInResponse>;
    GoogleSignIn(token: GoogleSignInDTO): Promise<LogInResponse>;
    GetUser(authUser: User): Promise<User>;
    GetUserById(userId: string): Promise<User>;
    GetUsers(): Promise<User[]>;
    UpdateInfo(data: UpdateInfoDTO, auth: User): Promise<void>;
    UpdateDetails(data: Partial<User>, auth: User): Promise<void>;
    UpdatePassword(data: UpdatePassWordDTO, auth: User): Promise<void>;
    ForgotPassword(email: string): Promise<void>;
    VerifyOTP(data: VerifyOtpDTO): Promise<{ token: string }>;
    ResetPassword(data: ResetPasswordDTO): Promise<void>;
}

export class AccountService implements IAccountService {
    constructor(
        private acctrepo: IAccountRepository,
        private otprepo: IOTPRepository,
        private acctnotif: IAccountNotification, // private activityrepo: IActivityRepository,
    ) {
        this.acctrepo = acctrepo;
        this.acctnotif = acctnotif;
        //     this.activityrepo = activityrepo;
    }

    async SignUp(data: SignUpDTO): Promise<void> {
        const emailExists = await this.acctrepo.getUserByEmail(data.email);

        if (emailExists) {
            throw new CustomError(
                'Account already exists, Log in instead.',
                StatusCode.BAD_REQUEST,
            );
        }
        const password = await encryptPassword(data.password);
        const userId = generateRandomId();

        const date = getCurrentTimeStamp();
        const user = {
            userId,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            status: UserAccountStatus.ACTIVE,
            password,
            emailVerified: false,
            createdOn: date,
            lastModifiedOn: date,
            createdBy: userId,
            modifiedBy: userId,
        };

        await this.acctrepo.saveUser(user);
        // send verifaication email
        const otp = generateRandomOTP();
        await this.otprepo.saveOTP({
            email: data.email,
            otp,
            expiresAt: date + 1200,
            wrongTrials: 0,
            status: OTPStatus.UNUSED,
        });
        this.acctnotif.verificationEmail(data.email, otp, data.firstName);

        // save activity
        // this.activityrepo.saveActivityLog({
        //     creator,
        //     activity: ActivityTypes.SIGN_UP,
        //     description: `${
        //         type === GeneralType.WHOLE_SALE ? 'WholeSale' : 'Retail'
        //     } Sign up by ${data.firstName} ${data.lastName} userId: ${userId}`,
        // });
    }

    async GoogleSignIn(data: GoogleSignInDTO): Promise<LogInResponse> {
        // validate google authentication
        const { data: userData }: { data: GoogleUserDTO } = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${data.accessToken}`,
            {
                headers: {
                    Authorization: `Bearer ${data.accessToken}`,
                    Accept: 'application/json',
                },
            },
        );

        const emailExists = await this.acctrepo.getUserByEmail(userData.email);

        const date = getCurrentTimeStamp();

        if (emailExists) {
            const token = generateAuthToken(emailExists.userId);

            delete emailExists.password;

            // this.activityrepo.saveActivityLog({
            //     creator: getModifier('user', emailExists.userId),
            //     activity: ActivityTypes.LOGIN,
            //     description: `${
            //         type === GeneralType.WHOLE_SALE ? 'WholeSale' : 'Retail'
            //     } Google sign in by userId: ${emailExists.userId}`,
            //     createdOn: date,
            // });

            return { token, user: emailExists };
        }
        console.log(userData);

        if (!userData.verified_email) {
            throw new CustomError('Unauthorized', StatusCode.UNAUTHORIZED);
        }

        const userId = generateRandomId();

        const user = {
            userId,
            email: userData.email,
            firstName: userData.given_name,
            lastName: userData.family_name,
            status: UserAccountStatus.ACTIVE,
            emailVerified: true,
            createdOn: date,
            lastModifiedOn: date,
            createdBy: userId,
            modifiedBy: userId,
        };

        await this.acctrepo.saveUser(user);

        const token = generateAuthToken(user.userId);

        return { token, user: await this.acctrepo.getUserById(userId) };
    }

    async LogIn(data: LogInDTO): Promise<LogInResponse> {
        const user = await this.acctrepo.getUserByEmail(data.email);
        if (!user) {
            throw new CustomError('Account not found', StatusCode.BAD_REQUEST);
        }
        const validPassword = await decryptPassword(
            data.password as string,
            user.password as string,
        );

        if (!validPassword) {
            throw new CustomError(
                'Invalid username or password',
                StatusCode.BAD_REQUEST,
            );
        }
        const token = generateAuthToken(user.userId);

        delete user.password;

        return { token, user };
    }

    async RequestVerification(auth: User): Promise<void> {
        if (auth.emailVerified) {
            throw new CustomError(
                `User email already verified`,
                StatusCode.BAD_REQUEST,
            );
        }
        const otp = generateRandomOTP();
        const expiresAt = getCurrentTimeStamp() + 600;

        await this.otprepo.saveOTP({
            email: auth.email,
            otp,
            expiresAt,
            wrongTrials: 0,
            status: OTPStatus.UNUSED,
        });

        // add message queue
        this.acctnotif.verificationEmail(auth.email, otp, auth.firstName);
    }

    async GetUser(authUser: User): Promise<User> {
        const user = authUser;
        delete user.password;
        return user;
    }

    async GetUserById(userId: string): Promise<User> {
        const user = await this.acctrepo.getUserById(userId);
        return user;
    }

    async GetUsers(): Promise<User[]> {
        const users = await this.acctrepo.getUsers();
        return users;
    }

    async VerifyEmail(
        data: VerifyOtpDTO,
    ): Promise<{ token: string; user: User }> {
        const user = await this.acctrepo.getUserByEmail(data.email);
        if (user.emailVerified) {
            throw new CustomError('User already verified', 200);
        }
        const verified = await this.otprepo.getOTP(data.email, data.otp);

        const date = getCurrentTimeStamp();
        if (
            !verified ||
            verified.expiresAt < date ||
            verified.status === OTPStatus.USED
        ) {
            throw new CustomError(
                'Invalid or expired OTP',
                StatusCode.BAD_REQUEST,
            );
        }
	await this.otprepo.useOTP(data.email, data.otp);
        await this.acctrepo.verifyEmail(data.email, date);

        const token = generateAuthToken(user.userId);

        delete user.password;

        return { token, user };
    }

    async UpdateInfo(data: UpdateInfoDTO, auth: User): Promise<void> {
        const accountInfo = auth;
        if (!accountInfo) {
            throw new CustomError('User not found', StatusCode.BAD_REQUEST);
        }

        const date = getCurrentTimeStamp();
        const newUserInfo = {
            userId: auth.userId,
            email: accountInfo.email,
            firstName: data.firstName || accountInfo.firstName,
            lastName: data.lastName || accountInfo.lastName,
            status: accountInfo.status,
            password: accountInfo.password,
            emailVerified: accountInfo.emailVerified,
            lastModifiedOn: date,
            modifiedBy: auth.userId,
        };
        await this.acctrepo.updateUser(newUserInfo);
    }

    async UpdateDetails(data: Partial<User>, auth: User): Promise<void> {
	const userDetails = data;

	if (!userDetails || Object.keys(userDetails).length === 0) {
            throw new CustomError('No fields provided to update.');
	}

        await this.acctrepo.updateUserFields(auth.userId, data);
    }

    async UpdatePassword(data: UpdatePassWordDTO, auth: User): Promise<void> {
        const userInfo = auth;

        if (!userInfo) {
            throw new CustomError('User not found', StatusCode.BAD_REQUEST);
        }
        const password = await encryptPassword(data.password);

        const date = getCurrentTimeStamp();
        await this.acctrepo.updatePassword(auth.userId, password, date);
    }

    async ForgotPassword(email: string): Promise<void> {
        const accountInfo = await this.acctrepo.getUserByEmail(email);
        if (!accountInfo) {
            return;
        }

        const otp = generateRandomOTP();
        const expiresAt = getCurrentTimeStamp() + 600; // expires in 10 minutes

        await this.otprepo.saveOTP({
            email,
            otp,
            expiresAt,
            wrongTrials: 0,
            status: OTPStatus.UNUSED,
        });

        // add message queue
        this.acctnotif.forgotPasswordEmail(email, otp, accountInfo.firstName);
    }

    async VerifyOTP(data: VerifyOtpDTO): Promise<{ token: string }> {
        const savedOtp = await this.otprepo.getOTP(data.email, data.otp);
        const date = getCurrentTimeStamp();
        console.log(savedOtp);
        if (
            !savedOtp ||
            date > savedOtp.expiresAt ||
            savedOtp.status === OTPStatus.USED
        )
            throw new CustomError(
                'Invalid OTP or expired',
                StatusCode.BAD_REQUEST,
            );
        await this.otprepo.useOTP(data.email, data.otp);

        const token = generateOtpToken(data.email);
        return { token };
    }

    public async ResetPassword(data: ResetPasswordDTO): Promise<void> {
        const { email } = verifyOtpToken(data.otpToken);
        if (!email) {
            throw new CustomError(
                'Token invalid or expired',
                StatusCode.BAD_REQUEST,
            );
        }
        const user = await this.acctrepo.getUserByEmail(email);

        if (!user) {
            throw new CustomError('user not found', StatusCode.UNAUTHORIZED);
        }

        const date = getCurrentTimeStamp();
        const password = await encryptPassword(data.newPassword);

        await this.acctrepo.updatePassword(user.userId, password, date);
    }
}
