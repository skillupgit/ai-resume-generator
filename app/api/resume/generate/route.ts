import OpenAI from "openai";
    import { SYSTEM_PROMPT } from "@/app/lib/prompts/system";
    import { ROLE_HINTS } from "@/app/lib/prompts/roles";

    export async function POST(req: Request) {
      const { role = "QA Analyst", jdText = "", uploadedResumeText = "" } = await req.json();
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-placeholder" });

      const userPrompt = `Role: ${role}
Job Description (excerpt):
${jdText.slice(0, 2000)}

Existing Resume (optional excerpt):
${uploadedResumeText.slice(0, 2000)}

Role hints: ${(ROLE_HINTS[role]||[]).join(", ")}
Return compact JSON with sections: Summary, Skills{Tools,Frameworks}, Experience[], Education[], Certifications[].`;

      // Lightweight call; you will swap to structured outputs later.
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: userPrompt }],
        temperature: 0.4,
      });

      const text = completion.choices[0]?.message?.content || "{}";
      try { JSON.parse(text); } catch { /* In case, wrap */ }
      return new Response(text, { headers: { "content-type": "application/json" } });
    }
