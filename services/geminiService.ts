
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function getStyleAdvice(query: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `O usuário está perguntando sobre estilo de cabelo/barba na barbearia Victor Mota Barber. 
      Responda de forma curta, jovem, descontraída e profissional em Português do Brasil.
      Pergunta: ${query}`,
      config: {
        systemInstruction: "Você é o assistente virtual da barbearia Victor Mota Barber. Use gírias modernas como 'na régua', 'vibe', 'top', 'brabo', mas mantenha a educação.",
      },
    });
    return response.text || "Mano, o estilo é você quem faz, mas se precisar de ajuda real, cola no salão!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Mano, deu um erro aqui na conexão, mas cola aí que a gente resolve seu estilo ao vivo!";
  }
}
