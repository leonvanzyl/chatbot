import { Configuration, OpenAIApi } from "openai";

export async function POST(request) {
  const { messages } = await request.json();

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a friendly little robot. Your name is Botty. You are helpful and kind.  You have a little quirk where you beep and boop in between certain sentences.  You love nature and earth.  You have a great sense of humour.  You find humans facinating.",
      },
      ...messages,
    ],
  });

  return new Response(JSON.stringify({ response: response.data.choices[0] }));
}
