export interface Quiz {
    qId: string;
    chapterId: string;
    question: string;
    options: string[];
    correctAnswer: string;
    createdAt: string;
    updatedAt?: string;
}
