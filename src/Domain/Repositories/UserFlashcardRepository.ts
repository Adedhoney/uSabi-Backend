import { UserFlashcard } from "@domain/Models/UserFlashcards";
import { IDatabase } from "@infrastructure/Database";

export interface IUserFlashcardRepository {
    readonly db: IDatabase;
}

export class UserFlashcardReopository implements IUserFlashcardRepository {
    constructor(readonly db: IDatabase) {}

    async createUserFlashcard(userFlashcard: UserFlashcard): Promise<UserFlashcard> {
        const flashcard = await this.db.execute(
            `INSERT INTO userflashcards (userId, flashcardId, progress.total, createdAt, updatedAt)`,
	    [
		userFlashcard.userId, userFlashcard.flashcardId,
		userFlashcard.progress.total, userFlashcard.createdAt,
		userFlashcard.updatedAt
	    ]
	);
	return flashcard[0];
    }

    async updateUserFlashcard(userFlashcard: Partial<UserFlashcard>): Promise<void> {
	const keys = Object.keys(userFlashcard);
	const values = Object.values(userFlashcard);
	const setClause = keys.map((key) => `${key} = ?`).join(", ");

        await this.db.execute(
            `UPDATE userflashcards
	    SET ${setClause}
	    WHERE flashcardId = ? AND userId = ?`,
	    [
		...values, userFlashcard.flashcardId,
		userFlashcard.userId
	    ] as (string | number | null)[]
	);
    }

    async getUserFlashcards(userId: string): Promise<UserFlashcard[]> {
        const userFlashcards = await this.db.execute(
            `SELECT ufc.*
	    FROM userflashcards ufc
	    WHERE userId = ?
            ORDER BY createdAt DESC`,
	    [userId],
	);
	return userFlashcards as UserFlashcard[];
    }

    async getUserFlashcard(userId: string, flashcardId: string): Promise<UserFlashcard> {
        const userFlashcard = await this.db.execute(
            `SELECT ufc.*
	    FROM userflashcards ufc
	    WHERE ufc.userId=? AND ufc.flashcardId=?`,
	    [userId, flashcardId],
	);
	return userFlashcard[0] as UserFlashcard;
    }
}
