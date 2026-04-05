import { ConversionResult } from '../types';
import mammoth from 'mammoth';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const convertDocument = async (file: File, targetFormat: string, onProgress?: (progress: number) => void): Promise<ConversionResult> => {
  try {
    if (onProgress) onProgress(10);
    
    if (file.name.endsWith('.docx') && targetFormat === 'pdf') {
      const buffer = await file.arrayBuffer();
      if (onProgress) onProgress(30);
      
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      const text = result.value;
      if (onProgress) onProgress(50);
      
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      let page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const margin = 50;
      const fontSize = 12;
      
      let currentY = height - margin;
      
      // Simple text wrapping and pagination
      const lines = text.split('\n');
      for (const line of lines) {
        if (currentY < margin) {
          page = pdfDoc.addPage();
          currentY = height - margin;
        }
        
        page.drawText(line.substring(0, 100), {
          x: margin,
          y: currentY,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        
        currentY -= fontSize * 1.5;
      }
      
      if (onProgress) onProgress(80);
      
      const pdfBytes = await pdfDoc.save();
      if (onProgress) onProgress(100);
      
      return {
        success: true,
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
      };
    } else {
      // Fallback for unsupported documents
      return { success: false, error: 'Unsupported document conversion' };
    }
  } catch (error: any) {
    console.error('Document conversion error:', error);
    return { success: false, error: error.message || 'Document conversion failed' };
  }
};
