import { OpenAI } from "openai";

export async function POST(request) {
    // Clientni request kelganda (Runtime) ichida yarating:
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        // Agar kalit bo'lmasa, xato qaytaring
        return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not set" }), { status: 500 });
    }

    const openai = new OpenAI({ apiKey }); // ✅ Faqat so'rov kelganda yaratiladi

    // ... qolgan mantiq 'openai' orqali ishlatiladi
}