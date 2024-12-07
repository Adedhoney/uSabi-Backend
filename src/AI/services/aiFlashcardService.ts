import { AIAvatarMentor } from "@domain/Models";
import { DifficultyLevel, QA } from "@domain/Models/Flashcards";
import { openai } from "AI/models/openaiClient"

export const generateFlashcards = async (
    category: string, topic: string, avatar: string, level: string,
    numberOfQuestions: number
): Promise<QA[]> => {
    const systemMessage = `You an expert flashcard creator. Generate engaging flashcards with questions and answers based on the provided details. Ensure that each flashcard matches the specified difficulty level and is relevant to the topic.`;
    const userMessage = `Generate ${numberOfQuestions} flashcards for the following details:
    - Category: ${category}
    - Topic: ${topic}
    - Mentor: ${avatar} (e.g., ${Object.values(AIAvatarMentor).join(", ")})
    - Difficulty Level: ${level} (${Object.values(DifficultyLevel).join(", ")})
    Format the response as a JSON array of objects with "question" and "answer" fields only.
    For example,
        [
            {
                "question": "What is blockchain technology?",
                 "answer": "Blockchain is a decentralized digital ledger used for recording transactions across multiple computers."
            },
            {
                "question": "What are the three main components of a blockchain?",
                "answer": "Blocks, nodes, and miners."
            }
        ]
    `;
    const completion = await openai.chat.completions.create({
        model: "gpt-4",
	messages: [
            { role: "system", content: systemMessage },
	    { role: "user", content: userMessage },
	],
    });
    const flashcards = JSON.parse(
	completion.choices[0].message?.content || "[]"
    ) as QA[];
    console.log(flashcards);
    return flashcards;
}
