import { Course } from '@domain/Models/Course';
import { IDatabase } from '@infrastructure/Database';

export interface ICourseRepository {
    readonly db: IDatabase;
    getCourseWithDetailsById(courseId: string): Promise<any[]>;
    createCourse(course: Course): Promise<Course>;
    updateCourse(course: Partial<Course>): Promise<void>
    getAllCourses(): Promise<Course[]>;
    getCourseById(courseId: string): Promise<Course>;
    deleteCourseById(courseId: string): Promise<void>;
}

export class CourseRepository implements ICourseRepository {
    constructor(readonly db: IDatabase) {}

    async getCourseWithDetailsById(courseId: string): Promise<any[]> {
        const query = `
            SELECT
                c.*,
                ch.*,
                v.*,
                q.*
            FROM Courses c
            LEFT JOIN Chapters ch ON c.courseId = ch.courseId
            LEFT JOIN Videos v ON ch.chapterId = v.chapterId
            LEFT JOIN Quizzes q ON ch.chapterId = q.chapterId
            WHERE c.courseId = ?;
        `;
        const [rows] = await this.db.execute(query, [courseId]);
        return rows;
    }

    async createCourse(course: Course): Promise<Course> {
	await this.db.execute(
            `INSERT INTO courses (courseId, category, topic, description, createdAt)
	    VALUES (?,?,?,?,?)`
	    [
		course.courseId, course.category, course.topic,
		course.description || null, course.createdAt
	    ]
	);
	return course;
    }

    async getAllCourses(): Promise<Course[]> {
        const courses = await this.db.execute(
	    `SELECT c.*
	    FROM courses c
	    ORDER BY createdAt DESC`)
	return courses as Course[];
    }

    async deleteCourseById(courseId: string): Promise<void> {
        await this.db.execute(
            `DELETE FROM courses
	    WHERE courseId = ?`,
	    [courseId]
	);
    }

    async getCourseById(courseId: string): Promise<Course> {
        const [course] = await this.db.execute(
            `SELECT c.*
	    FROM courses as c
	    WHERE c.courseId=?`,
	    [courseId],
	);
	return course as Course;
    }

    async updateCourse(course: Partial<Course>): Promise<void> {
	const keys = Object.keys(course);
	const values = Object.values(course);

        const setClause = keys.map((key) => `${key} = ?`).join(", ");
        await this.db.execute(
	    `UPDATE courses
	    SET ${setClause}
	    WHERE courseId = ?`,
	    [...values, course.courseId]
	);
    }
}
