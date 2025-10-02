import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const VECTOR_STORE_ID = "vs_68de9050f9e48191846ca9ed9376626a";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      tools: [
        {
          type: "file_search",
          file_search: { vector_store_ids: [VECTOR_STORE_ID] }
        }
      ],
      tool_choice: "auto"
    });

    res.status(200).json({ reply: response.choices[0].message });
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: error.message });
  }
}
