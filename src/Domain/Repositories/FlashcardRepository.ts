import { Flashcard } from "@domain/Models/Flashcards";
import { IDatabase } from "@infrastructure/Database";

export interface IFlashcardRepository {
    readonly db: IDatabase;
    getAllFlashcards(): Promise<Flashcard[]>;
    getFlashcardById(flashcardId: string): Promise<Flashcard>;
    createFlashcard(flashcard: Flashcard): Promise<Flashcard>;
    updateFlashcard(flashcardId: string, flashcard: Partial<Flashcard>): Promise<void>;
}

export class FlashcardRepository implements IFlashcardRepository {
    constructor(readonly db: IDatabase) {}

    async getAllFlashcards(): Promise<Flashcard[]> {
        const flashcards = await this.db.execute(
            `SELECT fc.*
            FROM flashcards fc
	    ORDER BY fc.createdAt DESC`
	);
	return flashcards as Flashcard[];
    }

    async getFlashcardById(flashcardId: string): Promise<Flashcard> {
        const [flashcard] = await this.db.execute(
            `SELECT fc.*
	    FROM flashcards as fc
	    WHERE fc.id=?`,
	    [flashcardId],
	);

	return {
		...flashcard,
		qas: flashcard.qas ? JSON.parse(flashcard.qas) : []
	} as Flashcard;
    }

    async createFlashcard(data: Flashcard): Promise<Flashcard> {
        const [flashcard] = await this.db.execute(
            `INSERT INTO flashcards (category, title, avatar, qas, point, difficulty, numberOfQuestions)
	    VALUES (?,?,?,?,?,?,?) RETURNING *`,
	    [
		data.category, data.title, data.avatar,
		JSON.stringify(data.qas), data.point,
		data.difficulty, data.numberOfQuestions
	    ]
	);
	return flashcard;
    }

    async updateFlashcard(flashcardId: string, flashcard: Partial<Flashcard>): Promise<void> {
	const keys = Object.keys(flashcard);
	const values = Object.values(flashcard).map((value, index) => {
            if (keys[index] === "qas" && Array.isArray(value)) {
                return JSON.stringify(value);
	    }
	    return value;
	});

        const setClause = keys.map((key) => `${key} = ?`).join(", ");

	await this.db.execute(
            `UPDATE flashcards
            SET ${setClause}
	    WHERE id = ?`,
	    [...values, flashcardId] as (string | number | null)[]
	);
    }
}
