import { Flashcard } from "@domain/Models/Flashcards";
import { FlashcardRepository } from "@domain/Repositories/FlashcardRepository";
import { generateFlashcards } from "AI/services/aiFlashcardService";

export interface IFlashcardService {
    getFlashcards(): Promise<Flashcard[]>;
    getFlashcard(flashcardId: string): Promise<Flashcard>;
    createFlashcard(flashcard: Flashcard): Promise<void>;
    updateFlashcard(flashcardId: string, flashcard: Partial<Flashcard>): Promise<void>;
}

export class FlashcardService implements IFlashcardService {
    constructor(private flashcardrepo: FlashcardRepository) {}

    async getFlashcards(): Promise<Flashcard[]> {
        const flashcards = await this.flashcardrepo.getAllFlashcards();
	return flashcards as Flashcard[];
    }

    async getFlashcard(flashcardId: string): Promise<Flashcard> {
        const flashcard = await this.flashcardrepo.getFlashcardById(flashcardId);
	return flashcard as Flashcard;
    }

    async createFlashcard(flashcard: Flashcard): Promise<void> {
	const qas = await generateFlashcards(
            flashcard.category, flashcard.title, flashcard.avatar,
	    flashcard.difficulty, flashcard.numberOfQuestions
	);
	flashcard.qas = qas;
        await this.flashcardrepo.createFlashcard(flashcard);
    }

    async updateFlashcard(flashcardId: string, flashcard: Partial<Flashcard>): Promise<void> {
        await this.flashcardrepo.updateFlashcard(flashcardId, flashcard);
    }
}
