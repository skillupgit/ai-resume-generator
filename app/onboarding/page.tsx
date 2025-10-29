"use client";
import { useState } from "react";

export default function OnboardingPage() {
  const [form, setForm] = useState({ fullName:"", email:"", phone:"", role:"QA Analyst" });
  const [resumeText, setResumeText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [agree, setAgree] = useState(false);
  const [saved, setSaved] = useState(false);

  const onSubmit = async (e:any) => {
    e.preventDefault();
    if (!agree) return alert("Please accept Terms & Privacy.");
    const r = await fetch("/api/user", { method:"POST", body: JSON.stringify({ ...form, jobUrl, resumeText }) });
    setSaved(r.ok);
    if (!r.ok) alert("Failed to save.");
  };

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">Let’s get your resume done</h1>
      <form onSubmit={onSubmit} className="grid gap-4 max-w-xl">
        <input placeholder="Full name" className="border p-2 rounded" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}/>
        <input placeholder="Email" className="border p-2 rounded" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input placeholder="Phone" className="border p-2 rounded" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
        <select className="border p-2 rounded" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
          <option>QA Analyst</option><option>SDET</option><option>API Tester</option>
        </select>
        <textarea className="border p-2 rounded h-28" placeholder="Paste your current resume text (optional)" value={resumeText} onChange={e=>setResumeText(e.target.value)}/>
        <input placeholder="Job description link (optional)" className="border p-2 rounded" value={jobUrl} onChange={e=>setJobUrl(e.target.value)}/>
        <label className="flex items-center gap-2"><input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)}/> I agree to the <a className="underline" href="/terms">Terms</a> & <a className="underline" href="/privacy">Privacy</a>.</label>
        <button className="btn bg-black text-white" type="submit">Save & Continue</button>
      </form>
      {saved && <a className="underline text-blue-600" href="/generator">Go to Generator →</a>}
    </main>
  );
}
