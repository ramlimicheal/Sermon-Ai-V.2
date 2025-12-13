import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Printer, Check } from 'lucide-react';
import { SavedSermon } from '@/types';

interface SermonExportProps {
  sermon: SavedSermon;
  onClose: () => void;
}

export const SermonExport: React.FC<SermonExportProps> = ({ sermon, onClose }) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'print'>('pdf');
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    // Create formatted content
    const content = `
SERMON NOTES
${sermon.scripture}
${new Date(sermon.createdAt).toLocaleDateString()}

${sermon.notes || 'No notes available'}
    `.trim();

    if (exportFormat === 'print') {
      // Print functionality
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
                  line-height: 1.6;
                }
                h1 {
                  font-size: 24pt;
                  margin-bottom: 0.5em;
                  color: #1c1917;
                }
                .meta {
                  color: #78716c;
                  font-size: 12pt;
                  margin-bottom: 2em;
                }
                .content {
                  white-space: pre-wrap;
                  font-size: 12pt;
                }
                @media print {
                  body { padding: 0.5in; }
                }
              </style>
            </head>
            <body>
              <h1>${sermon.scripture}</h1>
              <div class="meta">${new Date(sermon.createdAt).toLocaleDateString()}</div>
              <div class="content">${sermon.notes || 'No notes available'}</div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } else {
      // Download as text file (simulating PDF/DOCX)
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sermon.scripture.replace(/[^a-z0-9]/gi, '_')}_sermon.${exportFormat === 'pdf' ? 'txt' : 'txt'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    setExported(true);
    setTimeout(() => {
      setExported(false);
      onClose();
    }, 1500);
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
          <Button onClick={handleExport} disabled={exported}>
            {exported ? (
              <>
                <Check className="h-4 w-4 mr-2" /> Exported!
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
