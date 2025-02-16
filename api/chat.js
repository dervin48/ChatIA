// api/chat.js
import { OpenAI } from "openai";
import { config } from "dotenv";

config(); // Cargar las variables de entorno desde el archivo .env

const client = new OpenAI({
  baseURL: "https://api.aimlapi.com/v1",
  apiKey: process.env.AIML_API_KEY, // Cargar la clave desde las variables de entorno
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { message } = req.body;

      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an AI assistant." },
          { role: "user", content: message },
        ],
      });

      res.status(200).json({ reply: response.choices[0].message.content });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Error al obtener respuesta de AIML API" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
