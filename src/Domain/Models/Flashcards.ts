import { AIAvatarMentor } from "./User";

export interface Flashcard {
    id?: number;
    flashcardId?: string;
    category: string;
    title: string;
    avatar: AIAvatarMentor;
    qas?: QA[];
    point: number;
    difficulty: DifficultyLevel;
    numberOfQuestions: QuestionSet;
}

export enum DifficultyLevel {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard",
}

export enum QuestionSet {
    WARM_UP = 5,
    SHORT_QUEST = 10,
    CHALLENGING_MISSION = 15,
}

export interface QA {
   question: string;
   answer: string;
}
