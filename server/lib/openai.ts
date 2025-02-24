import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function expandPrompt(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert prompt writer. You specialize in writing descriptive prompts for the AI image tool Stable Diffusion.",
        },
        {
          role: "user",
          content: `Write a concise prompt for this: ${prompt}. Only output the prompt itself, no extra text.`,
        },
      ],
    });

    return response.choices[0].message.content || prompt;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return prompt;
  }
}
