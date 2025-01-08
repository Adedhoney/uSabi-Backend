import { UserCourse } from "@domain/Models/UserCourse";
import { IDatabase } from "@infrastructure/Database";


export interface IUserCourseRepository {
    readonly db: IDatabase;
    enrol(userCourse: UserCourse): Promise<void>;
    getEnrolledCourse(userId: string, courseId: string): Promise<UserCourse>;
    enrolledCourses(userId: string): Promise<UserCourse[]>;
    isUserEnrolled(userId: string, courseId: string): Promise<boolean>;
    updateUserCourse(userCourse: Partial<UserCourse>): Promise<void>;
}

export class UserCourseRepository implements IUserCourseRepository {
    constructor(readonly db: IDatabase) {}
    
    async enrol(userCourse: UserCourse): Promise<void> {
        await this.db.execute(
	    `INSERT INTO user_courses (userId, courseId, completed, createdAt, updatedAt) VALUES (?,?,?,?,?)`,
	    [userCourse.userId, userCourse.courseId, userCourse.completed,
	    userCourse.enrolledAt, userCourse.updatedAt],
	);
    }

    async getEnrolledCourse(userId: string, courseId: string): Promise<UserCourse> {
        const [enrolledCourse] = await this.db.execute(
            `SELECT uc.*
	    FROM user_courses uc
	    WHERE userId=? AND courseId=?`,
	    [userId, courseId]
	);
	return enrolledCourse as UserCourse;
    }

    async enrolledCourses(userId: string): Promise<UserCourse[]> {
        const enrolledCourses = await this.db.execute(
	    `SELECT uc.*
	    FROM user_courses uc
	    WHERE userId=?
	    ORDER BY createdAt DESC`,
	    [userId]
	);
	return enrolledCourses as UserCourse[]
    }

    async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
        const [result] = await this.db.execute(
	    `SELCT COUNT(*) as count
	    FROM user_courses
	    WHERE userId=? AND courseId=?`,
	    [userId, courseId]
	);
	return result.count > 0;
    }

    async updateUserCourse(userCourse: Partial<UserCourse>): Promise<void> {
        const keys = Object.keys(userCourse);
	const values = Object.values(userCourse);

	const setClause = keys.map((key) => `${key} = ?`).join(", ");

        await this.db.execute(
            `UPDATE user_courses
	    SET ${setClause}
	    WHERE courseId=? AND userId=?`,
	    [...values, userCourse.courseId, userCourse.userId]
	);
    }
}
