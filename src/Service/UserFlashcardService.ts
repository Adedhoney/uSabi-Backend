import { UserFlashcard } from "@domain/Models/UserFlashcards";
import { UserFlashcardReopository } from "@domain/Repositories/UserFlashcardRepository";

export interface IUserFlashcardService {
    createUserFlashcard(flashcard: Omit<UserFlashcard, 'progress.completed'>): Promise<void>;
    updateUserFlashcard(flashcard: Partial<UserFlashcard>): Promise<void>;
    getUserFlashcard(userId: string, flashcardId: string): Promise<UserFlashcard>;
    getUserFlashcards(userId: string): Promise<UserFlashcard[]>;
}

export class UserFlashcardService implements IUserFlashcardService {
    constructor(private userflashcardrepo: UserFlashcardReopository) {
        this.userflashcardrepo = userflashcardrepo;
    }

    async createUserFlashcard(flashcard: Omit<UserFlashcard, 'progress.completed'>): Promise<void> {
        await this.userflashcardrepo.createUserFlashcard(flashcard);
    }

    async updateUserFlashcard(flashcard: Partial<UserFlashcard>): Promise<void> {
        await this.userflashcardrepo.updateUserFlashcard(flashcard);
    }

    async getUserFlashcard(userId: string, flashcardId: string): Promise<UserFlashcard> {
        const userFlashcard = await this.userflashcardrepo.getUserFlashcard(userId, flashcardId);
	return userFlashcard;
    }

    async getUserFlashcards(userId: string): Promise<UserFlashcard[]> {
        const userFlashcards = await this.userflashcardrepo.getUserFlashcards(userId);
	return userFlashcards;
    }
}
