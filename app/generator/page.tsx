"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function GeneratorPage() {
  const searchParams = useSearchParams();
  const [jd, setJd] = useState("");
  const [role, setRole] = useState("QA Analyst");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeJson, setResumeJson] = useState<any>(null);
  const [content, setContent] = useState("// Your generated resume will appear here...");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load user data from query params on mount
  useEffect(() => {
    const roleParam = searchParams.get("role");
    const jdParam = searchParams.get("jobUrl");
    const resumeTextParam = searchParams.get("resumeText");
    const fullNameParam = searchParams.get("fullName");
    const emailParam = searchParams.get("email");
    const phoneParam = searchParams.get("phone");
    
    if (roleParam) setRole(roleParam);
    if (fullNameParam) setFullName(decodeURIComponent(fullNameParam));
    if (emailParam) setEmail(decodeURIComponent(emailParam));
    if (phoneParam) setPhone(decodeURIComponent(phoneParam));
    if (jdParam) {
      setJd(jdParam);
      // Auto-generate resume if coming from onboarding with job description
      generateResume(roleParam || "QA Analyst", jdParam);
    }
  }, [searchParams]);

  const generateResume = async (selectedRole: string, jobDescription: string) => {
    setError("");
    setLoading(true);
    try {
      const r = await fetch("/api/resume/generate", { 
        method: "POST", 
        body: JSON.stringify({ role: selectedRole, jdText: jobDescription }) 
      });
      
      if (!r.ok) {
        const errorData = await r.json();
        throw new Error(errorData.error || "Failed to generate resume");
      }
      
      const data = await r.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      formatAndDisplayResume(data);
    } catch (err: any) {
      setError(err.message || "Unknown error occurred");
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatAndDisplayResume = (data: any) => {
    setResumeJson(data);
    
    // Format as readable resume text
    let formattedText = `${data.Summary || ''}\n\n`;
    
    if (data.Skills) {
      formattedText += `TECHNICAL SKILLS\n`;
      if (data.Skills.Tools?.length) formattedText += `Tools: ${data.Skills.Tools.join(', ')}\n`;
      if (data.Skills.Frameworks?.length) formattedText += `Frameworks: ${data.Skills.Frameworks.join(', ')}\n`;
      formattedText += `\n`;
    }
    
    if (data.Experience?.length) {
      formattedText += `PROFESSIONAL EXPERIENCE\n`;
      data.Experience.forEach((exp: any) => {
        formattedText += `\n${exp.title} - ${exp.company}\n`;
        formattedText += `${exp.startDate || ''} ${exp.endDate ? `- ${exp.endDate}` : ''}\n`;
        if (Array.isArray(exp.bullets)) {
          exp.bullets.forEach((bullet: string) => {
            formattedText += `• ${bullet}\n`;
          });
        }
      });
      formattedText += `\n`;
    }
    
    if (data.Education?.length) {
      formattedText += `EDUCATION\n`;
      data.Education.forEach((edu: any) => {
        formattedText += `\n${edu.degree}\n`;
        formattedText += `${edu.school}\n`;
        formattedText += `${edu.startDate || ''} ${edu.endDate ? `- ${edu.endDate}` : ''}\n`;
      });
      formattedText += `\n`;
    }
    
    if (data.Certifications?.length) {
      formattedText += `CERTIFICATIONS\n`;
      data.Certifications.forEach((cert: any) => {
        formattedText += `• ${cert.name}${cert.date ? ` (${cert.date})` : ''}\n`;
      });
    }
    
    setContent(formattedText);
  };

  const onGenerate = async () => {
    generateResume(role, jd);
  };
  const onExport = async () => {
    if (!resumeJson) return;

    // Dynamically import jsPDF and html2canvas
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;
    
    // Create a temporary div for rendering the resume
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '8.5in';
    tempDiv.style.padding = '1in';
    tempDiv.style.fontSize = '11px';
    tempDiv.style.lineHeight = '1.4';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.backgroundColor = '#ffffff';
    tempDiv.style.color = '#000000';
    document.body.appendChild(tempDiv);

    // Render resume content with professional formatting
    // Capitalize first letter of each word in name
    const capitalizedName = (fullName || 'Your Name')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    tempDiv.innerHTML = `
      <div style="margin: 0; padding: 0;">
        <!-- Header Section -->
        <div style="text-align: center; margin-bottom: 8px; border-bottom: 2px solid #333; padding-bottom: 6px;">
          <div style="font-size: 16px; font-weight: bold; margin: 0;">${capitalizedName}</div>
          <div style="font-size: 10px; margin: 2px 0; color: #333;">
            ${email ? `${email}` : ''} ${phone ? `| ${phone}` : ''}
          </div>
        </div>

        <!-- Professional Summary -->
        ${resumeJson.Summary ? `
          <div style="margin-bottom: 6px; margin-top: 8px;">
            <div style="font-weight: bold; font-size: 14px; padding-bottom: 5px; border-bottom: 1px solid #999; margin-bottom: 6px;">PROFESSIONAL SUMMARY</div>
            <div style="margin-left: 0; font-size: 12px; line-height: 1.4;">
              ${resumeJson.Summary}
            </div>
          </div>
        ` : ''}

        <!-- Technical Skills -->
        ${resumeJson.Skills && resumeJson.Skills.Technical ? `
          <div style="margin-bottom: 6px; margin-top: 8px;">
            <div style="font-weight: bold; font-size: 14px; padding-bottom: 5px; border-bottom: 1px solid #999; margin-bottom: 6px;">TECHNICAL SKILLS</div>
            <div style="margin-left: 0; font-size: 12px; line-height: 1.5;">
              ${Array.isArray(resumeJson.Skills.Technical) ? resumeJson.Skills.Technical.map((skill: string) => `
                <div style="margin-bottom: 3px;">${skill}</div>
              `).join('') : ''}
            </div>
          </div>
        ` : ''}

        <!-- Professional Experience -->
        ${resumeJson.Experience ? `
          <div style="margin-bottom: 6px; margin-top: 8px;">
            <div style="font-weight: bold; font-size: 14px; padding-bottom: 5px; border-bottom: 1px solid #999; margin-bottom: 6px;">PROFESSIONAL EXPERIENCE</div>
            ${resumeJson.Experience.map((exp: any) => `
              <div style="margin-bottom: 4px;">
                <div style="font-weight: bold; font-size: 12px; margin-bottom: 1px;">
                  ${exp.title || ''} – ${exp.company || ''}
                </div>
                <div style="font-size: 11px; color: #555; margin-bottom: 6px;">
                  ${exp.startDate || ''} ${exp.endDate ? `– ${exp.endDate}` : '– Present'}
                </div>
                ${Array.isArray(exp.bullets) ? `
                  <ul style="margin:0; padding-left:18px;">
                    ${exp.bullets.map((bullet: string) => `<li style=\"margin-bottom:6px; font-size:12px; line-height:1.4;\">${bullet}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Education & Certifications -->
        ${(resumeJson.Education || resumeJson.Certifications) ? `
          <div style="margin-bottom: 6px; margin-top: 8px;">
            <div style="font-weight: bold; font-size: 14px; padding-bottom: 5px; border-bottom: 1px solid #999; margin-bottom: 6px;">EDUCATION & CERTIFICATIONS</div>
            ${resumeJson.Education ? resumeJson.Education.map((edu: any) => `
              <div style="margin-bottom: 6px;">
                <div style="font-weight: bold; font-size: 12px; margin-bottom: 1px;">${edu.degree || ''}</div>
                <div style="font-size: 12px; margin-bottom: 1px;">${edu.school || ''}</div>
                <div style="font-size: 11px; color: #555;">${edu.startDate || ''} ${edu.endDate ? `– ${edu.endDate}` : ''}</div>
              </div>
            `).join('') : ''}

            ${resumeJson.Certifications ? `
              <div style="margin-top: 6px;">
                <div style="font-weight: bold; font-size: 12px; margin-bottom: 4px;">Certifications</div>
                <ul style="margin:0; padding-left:18px; font-size:12px;">
                  ${resumeJson.Certifications.map((cert: any) => `<li style=\"margin-bottom:6px;\">${cert.name}${cert.date ? ` (${cert.date})` : ''}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;

    try {
      // Convert the div to canvas with high quality
      const canvas = await html2canvas(tempDiv, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      // Create PDF with proper A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Get PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image dimensions to fit properly
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

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
        
        {/* Display User Info (read-only) */}
        {(fullName || email || phone) && (
          <div className="border p-3 rounded bg-blue-50">
            <h3 className="font-semibold text-sm mb-2">Your Info</h3>
            {fullName && <div className="text-sm text-gray-700">{fullName}</div>}
            {email && <div className="text-sm text-gray-700">{email}</div>}
            {phone && <div className="text-sm text-gray-700">{phone}</div>}
          </div>
        )}

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
