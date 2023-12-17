import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

// Get OpenAI API key
export const getOpenAPIKey = () => {
  return process.env.OPEN_API_KEY;
};

// Get OpenAI model
export const getOpenAPIModel = () => {
  return "gpt-3.5-turbo";
  // return 'gpt-4';
};

export const POST = async (request) => {
  const { userId, prompt, tag } = await request.json();

  const aiResult = await callOpenAI(`Describe "${prompt}" in 3 sentences briefly`);

  console.log(prompt, aiResult)

  try {
    await connectToDB();
    const newPrompt = new Prompt({ creator: userId, prompt: aiResult, tag });

    await newPrompt.save();
    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};

const callOpenAI = async (prompt_gpt) => {
  const choiceCount = 1;
  // OpenAI API endpoint
  const url = `https://api.openai.com/v1/chat/completions`;

  // Body for API call
  const payload = {
    model: getOpenAPIModel(),
    n: choiceCount,
    messages: [
      {
        role: "user",
        content: prompt_gpt,
      },
    ],
  };

  // API call options
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getOpenAPIKey()}`,
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify(payload),
  };

  // API call to OpenAI
  const response = await fetch(url, options);
  let result = "";

  if (response.status === 200) {
    const chatCompletion = await response.json();
    const firstChoice = chatCompletion.choices[0];

    if (firstChoice) {
      result = firstChoice.message.content;
    } else {
      console.warn(
        `Chat completion response did not include any assistance choices.`
      );
      result = `AI response did not include any choices.`;
    }
  } else {
    const text = await response.text();
    result = text;
  }
  return result;
};
