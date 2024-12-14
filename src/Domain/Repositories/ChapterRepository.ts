import { Chapter } from "@domain/Models/Chapter";
import { IDatabase } from "@infrastructure/Database";

export interface IChapterRepository {
  createChapter(chapter: Chapter): Promise<Chapter>;
  updateChapter(chapter: Partial<Chapter>): Promise<void>;
  getAllCourseChapters(courseId: string): Promise<Chapter[]>;
  getChapterById(chapterId: string): Promise<Chapter>;
}

export class ChapterRepository implements IChapterRepository {
    constructor(private readonly db: IDatabase) {}

    async createChapter(chapter: Chapter): Promise<Chapter> {
        await this.db.execute(
	    `INSERT INTO chapters (chapterId, courseId, title, description, position, point, createdAt)
	    VALUES (?,?,?,?,?,?,?)`,
	    [
		chapter.chapterId, chapter.courseId, chapter.title,
	        chapter.description || null, chapter.position, chapter.point,
		chapter.createdAt
	    ]
	);
	return chapter;
    }

    async updateChapter(chapter: Partial<Chapter>): Promise<void> {
	const keys = Object.keys(chapter);
	const values = Object.values(chapter);

        const setClause = keys.map((key) => `${key} = ?`).join(", ");

        await this.db.execute(
	    `UPDATE chapters
	    SET ${setClause}
	    WHERE chapterId=?`,
	    [...values, chapter.chapterId]
	);
    }

    async getAllCourseChapters(courseId: string): Promise<Chapter[]> {
        const chapters = await this.db.execute(
	    `SELECT cp.*
	    FROM chapters cp
	    WHERE courseId=?
	    ORDER BY cp.position ASC, cp.createdAt ASC`,
	    [courseId]
	);
	return chapters as Chapter[];
    }

    async getChapterById(chapterId: string): Promise<Chapter> {
        const [chapter] = await this.db.execute(
	    `SELECT cp.*
	    FROM chapters cp
	    WHERE chapterId=?
	    ORDER BY cp.createdAt DESC`,
	    [chapterId]
	);
	return chapter as Chapter;
    }

    /*async deleteChapterById(chapterId: string): Promise<void> {
        
    }*/
}
