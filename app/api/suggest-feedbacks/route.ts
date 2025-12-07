import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function GET(req: Request) {
  try {
    // const { messages }: { messages: UIMessage[] } = await req.json();

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
    });

    console.log(JSON.stringify(result.response.body, null, 2))
    console.log(JSON.stringify(result.text))
    return new Response(JSON.stringify({
            success: true,
            data: result.text
        }), {status: 200});
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { issues } = error;
      console.error("Validation error:", issues);
      return new Response(
        JSON.stringify({ error: "Invalid input", details: issues }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      console.error("Error processing request:", error);
      throw error;
    }
  }
}
