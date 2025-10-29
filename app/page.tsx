import Link from "next/link";
export default function Home() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">AI Resume Generator</h1>
      <p className="text-gray-700">Create a tailored QA resume in minutes. Start with onboarding.</p>
      <div className="flex gap-3">
        <Link className="btn bg-black text-white" href="/onboarding">Get Started</Link>
        <Link className="btn bg-white border" href="/generator">Open Generator</Link>
      </div>
    </main>
  );
}
