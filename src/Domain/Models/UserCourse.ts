export interface UserCourse {
    id?: number;
    userId: string;
    courseId: string;
    // progress?: number;
    completed: boolean;
    enrolledAt: number;
    updatedAt?: number;
}
