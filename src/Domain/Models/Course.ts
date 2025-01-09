import { AIAvatarMentor } from "./User";

export interface Course {
    courseId: string;
    category: string;
    topic: string;
    description?: string;
    avatar: AIAvatarMentor;
    createdAt: number;
    updatedAt?: number;
}
