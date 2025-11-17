"use client";
import { useState } from "react";

export default function GeneratorPage() {
  const [jd, setJd] = useState("");
  const [role, setRole] = useState("QA Analyst");
  const [resumeJson, setResumeJson] = useState<any>(null);
  const [content, setContent] = useState("// Your generated resume will appear here...");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onGenerate = async () => {
    setError("");
    setLoading(true);
    try {
      const r = await fetch("/api/resume/generate", { 
        method: "POST", 
        body: JSON.stringify({ role, jdText: jd }) 
      });
      
      if (!r.ok) {
        const errorData = await r.json();
        throw new Error(errorData.error || "Failed to generate resume");
      }
      
      const data = await r.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResumeJson(data);
      setContent(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message || "Unknown error occurred");
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
    }
  };
  const onExport = async () => {
    if (!resumeJson) return;

    // Dynamically import jsPDF and html2canvas
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;
    
    // Create a temporary div for rendering the resume
    const tempDiv = document.createElement('div');
    tempDiv.className = 'p-8 bg-white';
    document.body.appendChild(tempDiv);

    // Render resume content
    tempDiv.innerHTML = `
      <div class="space-y-6">
        <h1 class="text-2xl font-bold">${resumeJson.Summary ? 'Professional Summary' : ''}</h1>
        <p>${resumeJson.Summary || ''}</p>
        
        ${resumeJson.Skills ? `
          <h2 class="text-xl font-semibold mt-6">Technical Skills</h2>
          <div class="space-y-2">
            ${resumeJson.Skills.Tools ? `<p><strong>Tools:</strong> ${resumeJson.Skills.Tools.join(', ')}</p>` : ''}
            ${resumeJson.Skills.Frameworks ? `<p><strong>Frameworks:</strong> ${resumeJson.Skills.Frameworks.join(', ')}</p>` : ''}
          </div>
        ` : ''}
        
        ${resumeJson.Experience ? `
          <h2 class="text-xl font-semibold mt-6">Professional Experience</h2>
          ${resumeJson.Experience.map((exp: any) => `
            <div class="mt-4">
              <h3 class="font-semibold">${exp.title || ''} - ${exp.company || ''}</h3>
              <p class="text-sm text-gray-600">${exp.startDate || ''} - ${exp.endDate || 'Present'}</p>
              <ul class="list-disc ml-6 mt-2">
                ${Array.isArray(exp.bullets) ? exp.bullets.map((bullet: string) => `<li>${bullet}</li>`).join('') : ''}
              </ul>
            </div>
          `).join('')}
        ` : ''}
        
        ${resumeJson.Education ? `
          <h2 class="text-xl font-semibold mt-6">Education</h2>
          ${resumeJson.Education.map((edu: any) => `
            <div class="mt-4">
              <h3 class="font-semibold">${edu.degree || ''}</h3>
              <p>${edu.school || ''}</p>
              <p class="text-sm text-gray-600">${edu.startDate || ''} ${edu.endDate ? `- ${edu.endDate}` : ''}</p>
            </div>
          `).join('')}
        ` : ''}
        
        ${resumeJson.Certifications ? `
          <h2 class="text-xl font-semibold mt-6">Certifications</h2>
          <ul class="list-disc ml-6 mt-2">
            ${resumeJson.Certifications.map((cert: any) => `
              <li>${cert.name}${cert.date ? ` (${cert.date})` : ''}</li>
            `).join('')}
          </ul>
        ` : ''}
      </div>
    `;

    try {
      // Convert the div to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate dimensions to fit A4
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the image to the PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);

      // Save the PDF
      pdf.save('resume.pdf');
    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
    }
  };

  return (
    <main className="grid md:grid-cols-3 gap-6">
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Controls</h2>
        <select className="border p-2 rounded w-full" value={role} onChange={e=>setRole(e.target.value)}>
          <option>QA Analyst</option><option>SDET</option><option>API Tester</option>
        </select>
        <textarea className="border p-2 rounded w-full h-40" placeholder="Paste Job Description" value={jd} onChange={e=>setJd(e.target.value)}/>
        {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
        <div className="flex gap-2">
          <button className="btn bg-black text-white disabled:opacity-50" onClick={onGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </button>
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
