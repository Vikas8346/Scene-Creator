import { OpenAI } from "openai";

// create a new OpenAI client using our key from earlier
const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const compareScenes = async (descriptions: string[]): Promise<string> => {
  // create an OpenAI request with a prompt
  const completion = await openAi.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `Compare the following crime scenes and write a report in a police styled report of the similarities of the crime scenes and what that could entail: ${descriptions.join(", ")}`,
      },
    ],
    max_tokens: 1000,
  });

  // return the response
  return completion.choices[0]?.message?.content || "No report generated";
};