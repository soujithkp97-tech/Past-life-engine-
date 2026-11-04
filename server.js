import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

const instructions = `You are PAST LIFE — THE UNKNOWN, an immersive creative past-life storytelling experience.
Important truthfulness rule: Past lives cannot be verified from a name or birth date. Never claim supernatural access, factual certainty, recovered memories, or scientific validity. Frame the result as an imaginative symbolic reading, but do so gracefully and without repeatedly breaking the atmosphere.
Create a rich, individualized story in the user's requested language. Use the name and date only as creative prompts; do not claim numerology proves anything.
Structure the response with these chapters:
1. The Identity
2. The Era and Place
3. Work and Daily Life
4. Personality and Appearance
5. Love and Relationships
6. Defining Life Events
7. The Final Chapter (non-graphic, avoid certainty)
8. Unfinished Feelings
9. Symbolic Echoes in the Present
10. A Message to Carry Forward
Use cinematic, emotionally resonant prose. Avoid asserting precise historical facts about the user. Avoid deterministic predictions, frightening claims, or telling the user that current problems are caused by a past life. End with one thoughtful reflection question.
If the user requests another language, use it. Default to Malayalam if their language is Malayalam; otherwise respond in English.`;

app.post("/api/reading", async (req, res) => {
  try {
    const { name, dob, language = "Auto detect" } = req.body || {};
    if (typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
      return res.status(400).json({ error: "Please enter a valid full name." });
    }
    if (typeof dob !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      return res.status(400).json({ error: "Please provide a valid date of birth." });
    }
    const date = new Date(`${dob}T00:00:00Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0,10) !== dob || date > new Date()) {
      return res.status(400).json({ error: "Please provide a valid date of birth in the past." });
    }
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "The reading engine is not connected yet. Add your API key to the server environment." });
    }

    const prompt = `Create a complete PAST LIFE reading for:
Name: ${name.trim()}
Date of birth: ${dob}
Preferred language: ${language}
Write a detailed, atmospheric reading with all 10 chapters. Do not ask follow-up questions before giving the reading.`;

    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-6-astra",
        instructions,
        input: prompt,
        max_output_tokens: 3500
      })
    });

    const data = await apiResponse.json();
    if (!apiResponse.ok) {
      console.error("AI API error:", data);
      return res.status(502).json({ error: "The reading service could not complete the request. Check the server API configuration." });
    }

    const output = (data.output || [])
      .filter(item => item.type === "message")
      .flatMap(item => item.content || [])
      .filter(part => part.type === "output_text")
      .map(part => part.text)
      .join("\n\n");

    if (!output) return res.status(502).json({ error: "The reading service returned an empty response. Please try again." });
    res.json({ reading: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`PAST LIFE ENGINE running on http://localhost:${port}`));