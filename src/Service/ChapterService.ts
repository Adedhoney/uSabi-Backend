import { generateRandomId, getCurrentTimeStamp } from "@application/utilities";
import { Chapter } from "@domain/Models/Chapter";
import { ChapterRepository } from "@domain/Repositories/ChapterRepository";

export interface IChapterService {
    createCourseChapter(chapter: Partial<Chapter>): Promise<Chapter>;
    updateCourseChapter(chapter: Partial<Chapter>): Promise<void>;
    fetchCourseChapters(courseId: string): Promise<Chapter[]>;
    fetchChapter(chapterId: string): Promise<Chapter>;
}

// type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export class ChapterService implements IChapterService {
    constructor(private chapterRepo: ChapterRepository) {}

    async createCourseChapter(chapter: Partial<Chapter>): Promise<Chapter> {
	chapter.createdAt = getCurrentTimeStamp();
	chapter.chapterId = generateRandomId();
        return await this.chapterRepo.createChapter(chapter as Chapter);
    }

    async updateCourseChapter(chapter: Partial<Chapter>): Promise<void> {
        await this.chapterRepo.updateChapter(chapter);
    }

    async fetchCourseChapters(courseId: string): Promise<Chapter[]> {
        return await this.chapterRepo.getAllCourseChapters(courseId);
    }

    async fetchChapter(chapterId: string): Promise<Chapter> {
        return await this.chapterRepo.getChapterById(chapterId);
    }
}
