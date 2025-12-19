import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Printer, Check, Loader } from 'lucide-react';
import { SavedSermon } from '@/types';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

interface SermonExportProps {
  sermon: SavedSermon;
  onClose: () => void;
}

export const SermonExport: React.FC<SermonExportProps> = ({ sermon, onClose }) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'print'>('pdf');
  const [exported, setExported] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let yPosition = 20;

    // Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(sermon.scripture, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 113, 108);
    doc.text(new Date(sermon.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }), pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;

    // Content
    doc.setFontSize(12);
    doc.setTextColor(28, 25, 23);
    doc.setFont('helvetica', 'normal');

    const notes = sermon.notes || 'No notes available';
    const lines = doc.splitTextToSize(notes, maxWidth);

    lines.forEach((line: string) => {
      if (yPosition > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 7;
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount} | Created with Preachr`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`${sermon.scripture.replace(/[^a-z0-9]/gi, '_')}_sermon.pdf`);
  };

  const generateDOCX = async () => {
    const notes = sermon.notes || 'No notes available';
    const paragraphs = notes.split('\n').filter(p => p.trim());

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: sermon.scripture,
                bold: true,
                size: 48,
                font: 'Georgia',
              }),
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          // Date
          new Paragraph({
            children: [
              new TextRun({
                text: new Date(sermon.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }),
                color: '78716c',
                size: 24,
                font: 'Georgia',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          // Divider
          new Paragraph({
            children: [
              new TextRun({
                text: '─'.repeat(50),
                color: 'cccccc',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          // Content paragraphs
          ...paragraphs.map(p => new Paragraph({
            children: [
              new TextRun({
                text: p,
                size: 24,
                font: 'Georgia',
              }),
            ],
            spacing: { after: 200, line: 360 },
          })),
          // Footer
          new Paragraph({
            children: [
              new TextRun({
                text: 'Created with Preachr',
                color: '999999',
                size: 20,
                italics: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 600 },
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sermon.scripture.replace(/[^a-z0-9]/gi, '_')}_sermon.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${sermon.scripture} - Sermon Notes</title>
            <style>
              body {
                font-family: 'Georgia', serif;
                max-width: 8.5in;
                margin: 0 auto;
                padding: 1in;
                line-height: 1.8;
                color: #1c1917;
              }
              h1 {
                font-size: 28pt;
                margin-bottom: 0.3em;
                text-align: center;
                font-weight: bold;
              }
              .meta {
                color: #78716c;
                font-size: 12pt;
                margin-bottom: 2em;
                text-align: center;
              }
              .divider {
                border-top: 1px solid #e5e5e5;
                margin: 1.5em 0;
              }
              .content {
                white-space: pre-wrap;
                font-size: 12pt;
                line-height: 1.8;
              }
              .footer {
                margin-top: 3em;
                text-align: center;
                color: #999;
                font-size: 10pt;
                font-style: italic;
              }
              @media print {
                body { padding: 0.5in; }
                .footer { position: fixed; bottom: 0.5in; left: 0; right: 0; }
              }
            </style>
          </head>
          <body>
            <h1>${sermon.scripture}</h1>
            <div class="meta">${new Date(sermon.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</div>
            <div class="divider"></div>
            <div class="content">${sermon.notes || 'No notes available'}</div>
            <div class="footer">Created with Preachr</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (exportFormat === 'print') {
        handlePrint();
      } else if (exportFormat === 'pdf') {
        generatePDF();
      } else if (exportFormat === 'docx') {
        await generateDOCX();
      }

      setExported(true);
      setTimeout(() => {
        setExported(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-bible-800 to-bible-700 p-6 text-white">
          <h2 className="text-2xl font-serif font-bold mb-2">Export Sermon</h2>
          <p className="text-bible-200 text-sm">{sermon.scripture}</p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-bible-700 mb-3">Export Format</label>
            <div className="space-y-2">
              <div
                onClick={() => setExportFormat('pdf')}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  exportFormat === 'pdf'
                    ? 'border-bible-700 bg-bible-50'
                    : 'border-bible-200 hover:border-bible-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-bible-700" />
                  <div>
                    <p className="font-semibold text-bible-900">PDF Document</p>
                    <p className="text-xs text-bible-500">Portable format for sharing</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setExportFormat('docx')}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  exportFormat === 'docx'
                    ? 'border-bible-700 bg-bible-50'
                    : 'border-bible-200 hover:border-bible-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-bible-700" />
                  <div>
                    <p className="font-semibold text-bible-900">Word Document</p>
                    <p className="text-xs text-bible-500">Editable format for further work</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setExportFormat('print')}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  exportFormat === 'print'
                    ? 'border-bible-700 bg-bible-50'
                    : 'border-bible-200 hover:border-bible-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Printer className="h-5 w-5 text-bible-700" />
                  <div>
                    <p className="font-semibold text-bible-900">Print</p>
                    <p className="text-xs text-bible-500">Print-ready pulpit notes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-bible-200 p-4 bg-bible-50 flex justify-between">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
                    <Button onClick={handleExport} disabled={exported || isExporting}>
                      {exported ? (
                        <>
                          <Check className="h-4 w-4 mr-2" /> Exported!
                        </>
                      ) : isExporting ? (
                        <>
                          <Loader className="h-4 w-4 mr-2 animate-spin" /> Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" /> Export
                        </>
                      )}
                    </Button>
        </div>
      </div>
    </div>
  );
};
