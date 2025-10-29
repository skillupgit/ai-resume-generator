"use client";
import { useState } from "react";

export default function GeneratorPage() {
  const [jd, setJd] = useState("");
  const [role, setRole] = useState("QA Analyst");
  const [resumeJson, setResumeJson] = useState<any>(null);
  const [content, setContent] = useState("// Your generated resume will appear here...");

  const onGenerate = async () => {
    const r = await fetch("/api/resume/generate", { method: "POST", body: JSON.stringify({ role, jdText: jd }) });
    const data = await r.json();
    setResumeJson(data);
    setContent(JSON.stringify(data, null, 2));
  };
  const onExport = async () => {
    const r = await fetch("/api/resume/export", { method:"POST", body: JSON.stringify({ resume: resumeJson }) });
    const b = await r.blob();
    const url = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = url; a.download = "resume.pdf"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="grid md:grid-cols-3 gap-6">
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Controls</h2>
        <select className="border p-2 rounded w-full" value={role} onChange={e=>setRole(e.target.value)}>
          <option>QA Analyst</option><option>SDET</option><option>API Tester</option>
        </select>
        <textarea className="border p-2 rounded w-full h-40" placeholder="Paste Job Description" value={jd} onChange={e=>setJd(e.target.value)}/>
        <div className="flex gap-2">
          <button className="btn bg-black text-white" onClick={onGenerate}>Generate</button>
          <button className="btn bg-white border" onClick={onExport} disabled={!resumeJson}>Download PDF</button>
        </div>
      </section>
      <section className="md:col-span-2">
        <h2 className="text-xl font-semibold mb-2">Resume Preview (editable)</h2>
        <textarea className="border p-2 rounded w-full h-[600px]" value={content} onChange={e=>setContent(e.target.value)}/>
      </section>
    </main>
  );
}
