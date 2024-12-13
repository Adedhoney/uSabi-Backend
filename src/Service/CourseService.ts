import { CustomError } from "@application/error";
import { generateRandomId, getCurrentTimeStamp, StatusCode } from "@application/utilities";
import { Course } from "@domain/Models/Course";
import { ICourseRepository } from "@domain/Repositories/CourseRepository";

export interface ICourseService {
    createCourse(course: Course): Promise<Course>;
    updateCourse(course: Partial<Course>): Promise<void>;
    fetchAllCourses(): Promise<Course[]>;
    fetchCourse(courseId:  string): Promise<Course>;
    deleteCourse(courseId: string): Promise<void>;
}

export class CourseService implements ICourseService {
    constructor(
        private courseRepo: ICourseRepository,
    ) {}

    async createCourse(course: Omit<Course, 'courseId' | 'createdAt'>): Promise<Course> {
	const newCourse = {
	    ...course,
	    courseId: generateRandomId(),
	    createdAt: getCurrentTimeStamp(),
	}
        return await this.courseRepo.createCourse(newCourse);
    }

    async updateCourse(course: Partial<Course>): Promise<void> {
        await this.courseRepo.updateCourse(course);
    }

    async fetchAllCourses(): Promise<Course[]> {
        const courses = await this.courseRepo.getAllCourses();
	if (!courses.length) {
	    throw new CustomError(
		'No courses found', StatusCode.NOT_FOUND
	    );
	}
	return courses as Course[];
    }

    async fetchCourse(courseId:  string): Promise<Course> {
        const course = await this.courseRepo.getCourseById(courseId);
	if (!course) {
            throw new CustomError(
		'Course not found', StatusCode.NOT_FOUND
	    );
	}
	return course as Course;
    }

    async deleteCourse(courseId: string): Promise<void> {
        await this.courseRepo.deleteCourseById(courseId);
    }
}
