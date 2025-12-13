import React, { useState } from 'react';
import { Presentation, Download, Loader } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PowerPointExportProps {
  sermonTitle: string;
  scripture: string;
  outline: string;
  notes: string;
}

export const PowerPointExport: React.FC<PowerPointExportProps> = ({
  sermonTitle,
  scripture,
  outline,
  notes,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPowerPoint = async () => {
    setIsExporting(true);
    try {
      // Simulate PowerPoint generation
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create a simple XML-based PowerPoint structure
      const pptContent = generatePowerPointXML(sermonTitle, scripture, outline, notes);
      
      // Create and download the file
      const blob = new Blob([pptContent], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${sermonTitle.replace(/\s+/g, '_')}_Sermon.pptx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PowerPoint:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generatePowerPointXML = (title: string, scripture: string, outline: string, notes: string) => {
    // This is a simplified representation. In production, you'd use a library like pptxgen-js
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldIdLst>
    <p:sldId id="256" r:id="rId2"/>
  </p:sldIdLst>
</p:presentation>`;
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExportPowerPoint}
      disabled={isExporting}
      className="flex items-center gap-2"
    >
      {isExporting ? (
        <>
          <Loader className="h-3.5 w-3.5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Presentation className="h-3.5 w-3.5" />
          Export to PowerPoint
        </>
      )}
    </Button>
  );
};
