import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker from the public folder
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    const pdf = await pdfjsLib.getDocument({ 
      data: new Uint8Array(arrayBuffer),
    }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => (item as any).str || '')
          .join(' ');
        fullText += pageText + '\n';
      } catch (pageError) {
        console.warn(`Error extracting page ${i}:`, pageError);
        continue;
      }
    }
    
    if (!fullText.trim()) {
      throw new Error('No text could be extracted from the PDF');
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
