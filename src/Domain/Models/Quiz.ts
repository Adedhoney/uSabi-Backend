export interface Quiz {
    qId: string;
    chapterId: string;
    qas: QuizQA[];
    createdAt: number;
    updatedAt?: number;
}

export interface QuizQA {
    question: string,
    options: string[],
    correctAnswer: string
}
