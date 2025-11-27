import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askTeacher = async (context: string, question: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context: ${context}\n\nStudent Question: ${question}`,
      config: {
        systemInstruction: "你是一位超级有趣、充满活力且富有鼓励性的小学四年级数学老师。你的名字叫“Poly 教授”。请使用中文，多用表情符号，语言通俗易懂，答案保持简短（50字以内）。重点在于表扬学生的提问，并用生动的比喻解释平行四边形的概念。",
      }
    });
    return response.text || "哎呀，我刚才走神了！你能再说一遍吗？";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "哎呀，我的大脑回路有点卡住了。请再问一次！";
  }
};