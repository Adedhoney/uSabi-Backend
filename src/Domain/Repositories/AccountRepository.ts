import { User } from '@domain/Models';
import { IDatabase } from '@infrastructure/Database';

export interface IAccountRepository {
    readonly db: IDatabase;
    saveUser(user: User): Promise<void>;
    getUserById(userId: string): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    // BanUser(userId: string): Promise<void>;
    verifyEmail(email: string, date: number): Promise<void>;
    getUsers(): Promise<User[]>;
    // deleteUser(userId: string): Promise<void>;
    updateUser(user: User): Promise<void>;
    updatePassword(
        userId: string,
        password: string,
        date: number,
    ): Promise<void>;
}

export class AccountRepository implements IAccountRepository {
    constructor(readonly db: IDatabase) {}

    public async saveUser(user: User): Promise<void> {
        await this.db.execute(
            'INSERT INTO users (userId, email, firstname, lastname, status, password, emailVerified, createdOn, lastModifiedOn, createdBy, modifiedBy) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
            [
                user.userId,
                user.email,
                user.firstName,
                user.lastName,
                user.status,
                user.password,
                user.emailVerified,
                user.createdOn,
                user.lastModifiedOn,
                user.createdBy,
                user.modifiedBy,
            ],
        );
    }

    async emailExists(email: string): Promise<boolean> {
        const user = await this.db.execute(
            'SELECT * from users WHERE email = ?',
            [email],
        );
        if (user[0]) {
            return true;
        }
        return false;
    }

    async getUserById(userId: string): Promise<User> {
        const data = await this.db.execute(
            `SELECT u.*
            FROM users u
            WHERE u.userId=?`,
            [userId],
        );
        return data[0] as User;
    }
    async getUserByEmail(email: string): Promise<User> {
        const data = await this.db.execute(
            `SELECT u.*
            FROM users u
            WHERE u.email=?`,
            [email],
        );
        return data[0] as User;
    }

    async getUsers(): Promise<User[]> {
        const users = await this.db.execute(
            `SELECT u.*          
            FROM users u
            ORDER BY createdOn DESC`,
        );
        return users as User[];
    }

    // async BanUser(userId: string): Promise<void> {
    //     await this.db.execute(
    //         `UPDATE users SET status=?, lastModifiedOn=? WHERE userId=?`,
    //         [userId, Date.now(), userId],
    //     );
    // }

    async updateUser(user: User): Promise<void> {
        await this.db.execute(
            `UPDATE users
            SET email = ?, firstname = ?, lastname = ?, lastModifiedOn = ?, modifiedBy = ?
            WHERE userId = ?`,
            [
                user.email,
                user.firstName,
                user.lastName,
                user.lastModifiedOn,
                user.modifiedBy,
                user.userId,
            ],
        );
    }

    async verifyEmail(email: string, date: number): Promise<void> {
        await this.db.execute(
            `UPDATE users
            SET emailVerified = ${true}, lastModifiedOn = ?
            WHERE email = ?`,
            [date, email],
        );
    }

    async updatePassword(
        userId: string,
        password: string,
        date: number,
    ): Promise<void> {
        await this.db.execute(
            `UPDATE users
            SET password = ?, lastModifiedOn = ?
            WHERE userId = ?`,
            [password, date, userId],
        );
    }
}
