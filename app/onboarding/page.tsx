"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName:"", email:"", phone:"", role:"QA Analyst" });
  const [resumeText, setResumeText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e:any) => {
    e.preventDefault();
    setError("");
    if (!agree) {
      setError("Please accept Terms & Privacy.");
      return;
    }
    
    setLoading(true);
    try {
      const r = await fetch("/api/user", { 
        method:"POST", 
        body: JSON.stringify({ ...form, jobUrl, resumeText }) 
      });
      
      if (!r.ok) {
        const errorData = await r.json();
        throw new Error(errorData.error || "Failed to save user details");
      }
      
      const data = await r.json();
      
      // Redirect to generator with user data in query params
      const params = new URLSearchParams({
        role: form.role,
        resumeText: resumeText,
        jobUrl: jobUrl,
        fullName: form.fullName
      });
      router.push(`/generator?${params.toString()}`);
    } catch (err: any) {
      setError(err.message || "Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
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
        {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
        <button className="btn bg-black text-white disabled:opacity-50" type="submit" disabled={loading}>{loading ? "Saving..." : "Save & Continue"}</button>
      </form>
    </main>
  );
}
