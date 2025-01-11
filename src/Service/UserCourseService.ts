import { CustomError } from "@application/error";
import { getCurrentTimeStamp } from "@application/utilities";
import { UserCourse } from "@domain/Models/UserCourse";
import { CourseRepository } from "@domain/Repositories/CourseRepository";
import { IUserCourseRepository } from "@domain/Repositories/UserCourseRepository";

export interface IUserCourseService {
    enrolCourse(userCourse: Omit<UserCourse, 'completed' | 'enrolledAt' | 'updatedAt'>): Promise<void>;
    getEnrolledCourses(userId: string): Promise<UserCourse[]>;
    isUserEnrolled(userId: string, courseId: string): Promise<boolean>;
    updateUserCourse(userCourse: Partial<UserCourse>): Promise<void>;
}

export class UserCourseService implements IUserCourseService {
    constructor(
	private courseRepo: CourseRepository,
	private userCourseRepo: IUserCourseRepository
    ) {}

    async enrolCourse(
	userCourse: Omit<UserCourse, 'completed' | 'enrolledAt' | 'updatedAt'>
    ): Promise<void> {
	const newUserCourse = {
            ...userCourse,
	    completed: false,
	    enrolledAt: getCurrentTimeStamp(),
	}
	await this.userCourseRepo.enrol(newUserCourse);
    }

    async getEnrolledCourses(userId: string): Promise<UserCourse[]> {
        return await this.userCourseRepo.enrolledCourses(userId);
    }

    async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
	const course = await this.courseRepo.getCourseById(courseId);
	if (!courseId && course) {
            throw new CustomError('Enter a valid courseId');
	}
        return await this.userCourseRepo.isUserEnrolled(userId, courseId);
    }

    async updateUserCourse(userCourse: Partial<UserCourse>): Promise<void> {
	userCourse.updatedAt = getCurrentTimeStamp();
        await this.userCourseRepo.updateUserCourse(userCourse);
    }
}
