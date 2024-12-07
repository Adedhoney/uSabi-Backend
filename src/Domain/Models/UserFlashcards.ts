export interface UserFlashcard {
    id?: number;
    userId: string;
    flashcardId: string;
    progress: Progress;
    createdAt: number;
    updatedAt: number;
}

interface Progress {
    completed?: number;
    total: number;
};
