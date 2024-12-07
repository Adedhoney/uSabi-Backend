import {
    ResetPasswordDTO,
    UpdateInfoDTO,
    UpdatePassWordDTO,
} from '@api/DTO';
import { CustomError } from '@application/error';
import {
    encryptPassword,
    getCurrentTimeStamp,
    StatusCode,
    verifyOtpToken,
} from '@application/utilities';
import { User } from '@domain/Models';
import { IAccountRepository } from '@domain/Repositories';

export interface IUserService {
    GetUser(authUser: User): Promise<User>;
    GetUserById(userId: string): Promise<User>;
    GetUsers(): Promise<User[]>;
    UpdateInfo(data: UpdateInfoDTO, auth: User): Promise<void>;
    UpdateDetails(data: Partial<User>, auth: User): Promise<void>;
    UpdatePassword(data: UpdatePassWordDTO, auth: User): Promise<void>;
    ResetPassword(data: ResetPasswordDTO): Promise<void>;
}

export class UserService implements IUserService {
    constructor(
        private userrepo: IAccountRepository,
    ) {}

    async GetUser(authUser: User): Promise<User> {
        const user = authUser;
        delete user.password;
        return user;
    }

    async GetUserById(userId: string): Promise<User> {
        const user = await this.userrepo.getUserById(userId);
        return user;
    }

    async GetUsers(): Promise<User[]> {
        const users = await this.userrepo.getUsers();
        return users;
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
        await this.userrepo.updateUser(newUserInfo);
    }

    async UpdateDetails(data: Partial<User>, auth: User): Promise<void> {
	const userDetails = data;

	if (!userDetails || Object.keys(userDetails).length === 0) {
            throw new CustomError('No fields provided to update.');
	}

        await this.userrepo.updateUserFields(auth.userId, data);
    }

    async UpdatePassword(data: UpdatePassWordDTO, auth: User): Promise<void> {
        const userInfo = auth;

        if (!userInfo) {
            throw new CustomError('User not found', StatusCode.BAD_REQUEST);
        }
        const password = await encryptPassword(data.password);

        const date = getCurrentTimeStamp();
        await this.userrepo.updatePassword(auth.userId, password, date);
    }

    public async ResetPassword(data: ResetPasswordDTO): Promise<void> {
        const { email } = verifyOtpToken(data.otpToken);
        if (!email) {
            throw new CustomError(
                'Token invalid or expired',
                StatusCode.BAD_REQUEST,
            );
        }
        const user = await this.userrepo.getUserByEmail(email);

        if (!user) {
            throw new CustomError('user not found', StatusCode.UNAUTHORIZED);
        }

        const date = getCurrentTimeStamp();
        const password = await encryptPassword(data.newPassword);

        await this.userrepo.updatePassword(user.userId, password, date);
    }
}
