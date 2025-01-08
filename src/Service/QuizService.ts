import { generateRandomId, getCurrentTimeStamp } from "@application/utilities";
import { Quiz } from "@domain/Models/Quiz";
import { AccountRepository } from "@domain/Repositories";
import { ChapterRepository } from "@domain/Repositories/ChapterRepository";
import { CourseRepository } from "@domain/Repositories/CourseRepository";
import { QuizRepository } from "@domain/Repositories/QuizRepository";
import { generateQuiz } from "AI/services/aiQuizService";

export interface IQuizService {
    addQuiz(
	quiz: Omit<Quiz, 'qId' | 'qas' | 'createdAt'>,
	userId: string, numberOfQuestions: number
    ): Promise<Quiz>;
    // addQuestion(quiz: Partial<Quiz>): Promise<void>;
    fetchQuiz(chapterId: string): Promise<Quiz>;
    deleteQuiz(chapterId: string): Promise<void>;
}

export class QuizService implements IQuizService {
    constructor(
	private quizRepo: QuizRepository, private chapterRepo: ChapterRepository,
	private courseRepo: CourseRepository, private userRepo: AccountRepository
    ) {}

    async addQuiz(
	quiz: Omit<Quiz, 'qId' | 'qas' | 'createdAt'>,
	userId: string, numberOfQuestions: number
    ): Promise<Quiz> {
	const user = await this.userRepo.getUserById(userId);
	const chapter = await this.chapterRepo.getChapterById(quiz.chapterId);
	const course = await this.courseRepo.getCourseById(chapter.courseId);
	const quizQA = await generateQuiz(
	    course.category, course.topic, chapter.title,
	    numberOfQuestions, user.avatar, chapter.description
	);
	const newQuiz = {
            ...quiz,
	    qId: generateRandomId(),
	    createdAt: getCurrentTimeStamp(),
	    qas: quizQA
	}
        return await this.quizRepo.createQuiz(newQuiz);
    }

    /*async addQuestion(quiz: Partial<Quiz>): Promise<void> {
	await this.quizRepo.updateQuiz(quiz);
    }*/

    async fetchQuiz(chapterId: string): Promise<Quiz> {
        return await this.quizRepo.getQuizByChapterId(chapterId);
    }

    async deleteQuiz(chapterId: string): Promise<void> {
        await this.quizRepo.deleteChapterQuiz(chapterId);
   }
}
