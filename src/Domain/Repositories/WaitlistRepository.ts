import { WaitlistUser } from "@domain/Models/Waitlist";
import { IDatabase } from "@infrastructure/Database";

export interface IWaitlistRepository {
    addUser(user: WaitlistUser): Promise<WaitlistUser>;
    getWaitlist(): Promise<WaitlistUser[]>;
    verifyWaitlistEmail(email: string, date: number): Promise<void>;
    getWaitlistUserByEmail(email: string): Promise<WaitlistUser>;
}

export class WaitlistRepository implements IWaitlistRepository {
    constructor(private readonly db: IDatabase) {}

    async addUser(user: WaitlistUser): Promise<WaitlistUser> {
        await this.db.execute(
	    `INSERT INTO Waitlist (userId, firstName, lastName, email, emailVerified, createdAt) VALUES (?,?,?,?,?,?)`,
	    [
		user.userId, user.firstName || null, user.lastName || null,
		user.email, user.emailVerified || null, user.createdAt
	    ]
	);
	return user
    }

    async getWaitlist(): Promise<WaitlistUser[]> {
        const users = await this.db.execute(
	    `SELECT wu.*
	    FROM waitlist wu
	    ORDER BY createdAt DESC`,
	);
	return users as WaitlistUser[]
    }

    async verifyWaitlistEmail(email: string, date: number): Promise<void> {
        await this.db.execute(
	    `UPDATE waitlist
	    SET emailVerified=?, updatedAt=?
	    WHERE email=?`,
	    [true, date, email]
	);
    }

    async getWaitlistUserByEmail(email: string): Promise<WaitlistUser> {
        const [user] = await this.db.execute(
	    `SELECT wu.*
	    FROM waitlist wu
	    WHERE wu.email=?`,
	    [email]
	);
	return user as WaitlistUser;
    }
}
