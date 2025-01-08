import { Chapter } from "@domain/Models/Chapter";
import { Quiz } from "@domain/Models/Quiz";
import { IDatabase } from "@infrastructure/Database";

export interface IQuizRepository {
    createQuiz(question: Quiz): Promise<Quiz>;
    getQuizByChapterId(chapterId: string): Promise<Quiz>
    updateQuiz(chapter: Partial<Chapter>): Promise<void>;
    getQuizById(chapterId: string): Promise<Quiz>
    deleteChapterQuiz(chapterId: string): Promise<void>;
}

export class QuizRepository implements IQuizRepository {
    constructor(private readonly db: IDatabase) {}

    async createQuiz(quiz: Quiz): Promise<Quiz> {
        await this.db.execute(
	    `INSERT INTO quiz (qId, chapterId, qas, createdAt)
	    VALUES (?,?,?,?)`,
	    [
                quiz.qId, quiz.chapterId,
		JSON.stringify(quiz.qas), quiz.createdAt
	    ]
	);
	return quiz;
    }

    async updateQuiz(quiz: Partial<Quiz>): Promise<void> {
        const keys = Object.keys(quiz);
	const values = Object.values(quiz).map((value, index) => {
            if (keys[index] === "qas" && Array.isArray(value)) {
                return JSON.stringify(value);
	    }
	    return value;
	});

        const setClause = keys.map((key) => `${key} = ?`).join(", ");
	await this.db.execute(
	    `UPDATE quiz
	    SET ${setClause}
	    WHERE chapterId=?`,
	    [...values, quiz.chapterId] as (string | number | null)[]
	);
    }

    async appendQuestion(quiz: Partial<Quiz>): Promise<void> {
        const keys = Object.keys(quiz);
	const setClause = keys.map((key) => {
            if (key === "qas" && Array.isArray(quiz[key])) {
                return `${key} = JSON_ARRAY_APPEND(${key}, '$', CAST(? AS JSON))`;
	    }
	    return `${key} = ?`;
	}).join(", ");

	const values = keys.map((key) => {
            if (key === "qas" && Array.isArray(quiz[key])) {
                return JSON.stringify(quiz[key]);
            }
            return quiz[key as keyof Quiz];
        });

        await this.db.execute(
            `UPDATE quiz
            SET ${setClause}
            WHERE qId = ?`,
            [...values, quiz.qId] as (string | number | null)[]
        );
    }

    async getQuizByChapterId(chapterId: string): Promise<Quiz> {
        const [quiz] = await this.db.execute(
	    `SELECT q.*
	    FROM quiz q
	    WHERE chapterId=?`,
	    [chapterId]
	);
	return quiz as Quiz;
    }

    async getQuizById(qId: string): Promise<Quiz> {
        const [quiz] = await this.db.execute(
	    `SELECT q.*
	    FROM quiz q
	    WHERE qId=?`,
	    [qId]
	);
	return quiz as Quiz;
    }

    async deleteChapterQuiz(chapterId: string):Promise<void> {
        await this.db.execute(
	    `DELETE FROM quiz
	    WHERE chapterId=?`,
	    [chapterId]
	);
    }
}
