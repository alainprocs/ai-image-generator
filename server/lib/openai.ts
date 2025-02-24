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
          content: "You are an expert prompt writer. You specialize in writing descriptive prompts for the AI image tool Stable Diffusion. Your prompts should be detailed and focus on high-quality image attributes, lighting, atmosphere, and style.",
        },
        {
          role: "user",
          content: `Write a detailed and enhanced prompt for this image idea: "${prompt}". Only output the prompt itself, no extra text.`,
        },
      ],
    });

    const expandedPrompt = response.choices[0].message.content;
    console.log("Original prompt:", prompt);
    console.log("Enhanced prompt:", expandedPrompt);

    return expandedPrompt || prompt;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return prompt;
  }
}