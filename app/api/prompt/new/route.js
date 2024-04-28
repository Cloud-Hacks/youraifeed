import Prompt from "@models/prompt";
const { GoogleGenerativeAI } = require("@google/generative-ai");
import { connectToDB } from "@utils/database";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro"});

export const POST = async (request) => {
  const { userId, prompt, tag } = await request.json();

  const aiResult = await model.generateContent('Describe "${prompt}" in 3 sentences briefly');
  const response = await aiResult.response;
  const text = response.text();

  console.log(prompt, text)

  try {
    await connectToDB();
    const newPrompt = new Prompt({ creator: userId, prompt: text, tag });

    await newPrompt.save();
    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
