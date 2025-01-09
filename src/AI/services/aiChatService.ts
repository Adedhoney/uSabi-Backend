import { Chat } from "@domain/Models/Chat";
import { openai } from "AI/models/openaiClient";


export const generateChatResponse = async (
    userMessage: string, conversationContext: Chat[],
): Promise<string> => {
    const systemMessage = `You are a helpful assistant with vast knowledge. Engage in a friendly conversation, answer questions, and provide useful information. Be informative, polite, and concise.`;
    
    const messages = [
	{ role: "system", content: systemMessage },
        ...conversationContext.reduce((acc: any[], entry: Chat) => {
            acc.push({ role: "user", content: entry.userMessage });
	    acc.push({ role: "assistant", content: entry.aiResponse });
	    return acc;
	}, []),
	{ role: "user", content: userMessage },
    ];

    console.log(messages);

    const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages,
    });

    const aiResponse = completion.choices[0].message?.content || "Sorry, I couldn't get a response.";

    console.log(aiResponse);

    return aiResponse;
}
