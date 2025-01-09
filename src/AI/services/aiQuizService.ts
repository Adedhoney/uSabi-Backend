import { AIAvatarMentor } from "@domain/Models";
import { QuizQA } from "@domain/Models/Quiz";
import { openai } from "AI/models/openaiClient";


export const generateQuiz = async (
    category: string, topic: string, subtopic: string,
    numberOfQuestions: number, avatar: string, description?: string
): Promise<QuizQA[]> => {
    const systemMessage = `You are an expert quiz creator. Generate engaging quiz questions with options and a correct answer. The questions should align with the provided course details, focusing specifically on the subtopic (chapter title). Provide exactly one correct answer for each question in the 'correctAnswer' field, and include a list of options`;
    const userMessage = `Generate ${numberOfQuestions} quiz questions for the following course details:
    - Category: ${category}
    - Topic: ${topic}
    - Subtopic: ${subtopic}
    - Mentor: ${avatar} (e.g., ${Object.values(AIAvatarMentor).join(", ")})
    ${
        description
            ? `- Description: ${description} (this provides additional context for the questions).`
            : ""
    }
    Format the response as a JSON array of objects with the following fields:
    - "question": A string containing the question.
    - "options": An array of 4 possible answers (strings).
    - "correctAnswer": A string that matches one of the options and is the correct answer.
    
    For example,
    [
        {
            "question": "What is the main purpose of a blockchain?",
            "options": ["To secure data", "To store cryptocurrencies", "To record transactions securely", "To mine coins"],
            "correctAnswer": "To record transactions securely"
        },
        {
            "question": "Who created Bitcoin?",
            "options": ["Elon Musk", "Vitalik Buterin", "Satoshi Nakamoto", "Charlie Lee"],
            "correctAnswer": "Satoshi Nakamoto"
        }
    ]`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4",
	messages: [
            { role: "system", content: systemMessage },
	    { role: "user", content: userMessage },
	],
    });
    const quizData = JSON.parse(
	completion.choices[0].message?.content || "[]"
    ) as QuizQA[];

    console.log(quizData);

    return quizData;
}
