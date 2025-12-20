import React, { useState } from 'react';
import { Presentation, Loader } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import pptxgen from 'pptxgenjs';

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
      const pptx = new pptxgen();
      
      // Set presentation properties
      pptx.author = 'Preachr';
      pptx.title = sermonTitle || scripture;
      pptx.subject = 'Sermon Presentation';
      pptx.company = 'Preachr';
      
      // Define theme colors
      const primaryColor = '1c1917';
      const secondaryColor = '78716c';
      const accentColor = '92400e';

      // Slide 1: Title Slide
      const titleSlide = pptx.addSlide();
      titleSlide.background = { color: 'FFFFFF' };
      
      // Scripture reference (main title)
      titleSlide.addText(scripture || sermonTitle, {
        x: 0.5,
        y: 2.5,
        w: '90%',
        h: 1.5,
        fontSize: 44,
        fontFace: 'Georgia',
        color: primaryColor,
        bold: true,
        align: 'center',
      });
      
      // Sermon title (subtitle)
      if (sermonTitle && sermonTitle !== scripture) {
        titleSlide.addText(sermonTitle, {
          x: 0.5,
          y: 4,
          w: '90%',
          h: 0.8,
          fontSize: 24,
          fontFace: 'Georgia',
          color: secondaryColor,
          align: 'center',
        });
      }
      
      // Date
      titleSlide.addText(new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }), {
        x: 0.5,
        y: 4.8,
        w: '90%',
        h: 0.5,
        fontSize: 14,
        fontFace: 'Arial',
        color: secondaryColor,
        align: 'center',
      });

      // Slide 2+: Outline slides (if outline exists)
      if (outline && outline.trim()) {
        const outlinePoints = outline.split('\n').filter(line => line.trim());
        
        // Group outline points into slides (max 5 points per slide)
        const pointsPerSlide = 5;
        for (let i = 0; i < outlinePoints.length; i += pointsPerSlide) {
          const slidePoints = outlinePoints.slice(i, i + pointsPerSlide);
          const outlineSlide = pptx.addSlide();
          outlineSlide.background = { color: 'FFFFFF' };
          
          // Slide header
          outlineSlide.addText('Sermon Outline', {
            x: 0.5,
            y: 0.3,
            w: '90%',
            h: 0.6,
            fontSize: 28,
            fontFace: 'Georgia',
            color: accentColor,
            bold: true,
          });
          
          // Outline points
          slidePoints.forEach((point, index) => {
            const cleanPoint = point.replace(/^[\d\.\-\*\s]+/, '').trim();
            if (cleanPoint) {
              outlineSlide.addText(cleanPoint, {
                x: 0.8,
                y: 1.2 + (index * 0.9),
                w: '85%',
                h: 0.8,
                fontSize: 20,
                fontFace: 'Arial',
                color: primaryColor,
                bullet: { type: 'bullet', color: accentColor },
              });
            }
          });
        }
      }

      // Slide 3+: Notes slides (if notes exist)
      if (notes && notes.trim()) {
        const notesParagraphs = notes.split('\n\n').filter(p => p.trim());
        
        notesParagraphs.forEach((paragraph, idx) => {
          const notesSlide = pptx.addSlide();
          notesSlide.background = { color: 'FFFFFF' };
          
          // Slide header
          notesSlide.addText(`Notes ${idx + 1}`, {
            x: 0.5,
            y: 0.3,
            w: '90%',
            h: 0.6,
            fontSize: 24,
            fontFace: 'Georgia',
            color: secondaryColor,
          });
          
          // Notes content
          notesSlide.addText(paragraph.trim(), {
            x: 0.5,
            y: 1.2,
            w: '90%',
            h: 4,
            fontSize: 18,
            fontFace: 'Arial',
            color: primaryColor,
            valign: 'top',
          });
        });
      }

      // Final slide: Closing
      const closingSlide = pptx.addSlide();
      closingSlide.background = { color: 'FFFFFF' };
      
      closingSlide.addText('Thank You', {
        x: 0.5,
        y: 2.5,
        w: '90%',
        h: 1,
        fontSize: 44,
        fontFace: 'Georgia',
        color: primaryColor,
        bold: true,
        align: 'center',
      });
      
      closingSlide.addText(scripture || sermonTitle, {
        x: 0.5,
        y: 3.5,
        w: '90%',
        h: 0.6,
        fontSize: 20,
        fontFace: 'Georgia',
        color: secondaryColor,
        align: 'center',
      });
      
      closingSlide.addText('Created with Preachr', {
        x: 0.5,
        y: 5,
        w: '90%',
        h: 0.4,
        fontSize: 12,
        fontFace: 'Arial',
        color: 'AAAAAA',
        align: 'center',
        italic: true,
      });

      // Save the presentation
      const fileName = `${(sermonTitle || scripture).replace(/[^a-z0-9]/gi, '_')}_Sermon.pptx`;
      await pptx.writeFile({ fileName });
      
    } catch (error) {
      console.error('Error exporting PowerPoint:', error);
    } finally {
      setIsExporting(false);
    }
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
