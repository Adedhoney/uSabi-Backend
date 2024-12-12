export interface Chapter {
    chapterId: string;
    courseId: string;
    title: string;
    description?: string;
    position: number; //to define order in its course
    point: number; // to track progress and score
    createdAt: number;
    updatedAt?: number;
}
