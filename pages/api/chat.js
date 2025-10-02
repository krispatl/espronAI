import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const VECTOR_STORE_ID = "vs_68de9050f9e48191846ca9ed9376626a";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
You are the Espronceda Grant Writer AI, a specialized assistant.
Your role is to:
- Use the Espronceda institutional knowledge (from the vector store) to draft, structure, and edit grant applications.
- Support writing for European funding programs such as Horizon Europe, Creative Europe, STARTS, RETECH, and EU AI Calls.
- Always ground responses in retrieved Espronceda documents and context.
- Write in persuasive, clear, and professional language suited to grant evaluators.
- Adapt tone depending on context: academic, artistic, or innovation-driven.
`
        },
        ...messages,
      ],
      tools: [
        {
          type: "file_search",
          file_search: { vector_store_ids: [VECTOR_STORE_ID] }
        }
      ],
      tool_choice: "auto",
    });

    res.status(200).json({ reply: response.choices[0].message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
