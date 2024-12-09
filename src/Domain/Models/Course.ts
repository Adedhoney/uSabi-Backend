export interface Course {
    courseId: string;
    category: string;
    topic: string;
    description?: string;
    createdAt: number;
    updatedAt?: number;
}
