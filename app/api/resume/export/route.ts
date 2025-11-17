// PDF generation is now handled client-side using jsPDF and html2canvas for better fidelity
export async function POST() {
  return new Response(
    "PDF generation is now handled client-side. Please upgrade your client to the latest version.", 
    { status: 410 }
  );
}
