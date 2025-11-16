import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  DocumentIcon,
  CodeBracketIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExportMenu = ({ markdown, isDark, previewStyle, onNotification }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Export as Markdown
  const exportMarkdown = () => {
    try {
      setIsExporting(true);
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document-${Date.now()}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      onNotification?.('Markdown exported successfully', 'success');
    } catch (error) {
      console.error('Markdown export error:', error);
      onNotification?.('Failed to export Markdown', 'error');
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  // Export as HTML
  const exportHTML = async () => {
    try {
      setIsExporting(true);

      // Get the preview content
      const previewElement = document.querySelector('[data-preview-content]');
      if (!previewElement) {
        throw new Error('Preview content not found');
      }

      // Get computed styles
      const styles = `
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            background: ${isDark ? '#1e293b' : '#ffffff'};
            color: ${isDark ? '#e2e8f0' : '#1e293b'};
            line-height: 1.6;
          }
          pre {
            background: ${isDark ? '#0f172a' : '#f1f5f9'};
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
          }
          code {
            background: ${isDark ? '#334155' : '#e2e8f0'};
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
          }
          pre code {
            background: transparent;
            padding: 0;
          }
          blockquote {
            border-left: 4px solid #a855f7;
            margin: 16px 0;
            padding-left: 16px;
            color: ${isDark ? '#94a3b8' : '#64748b'};
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
          }
          th, td {
            border: 1px solid ${isDark ? '#475569' : '#cbd5e1'};
            padding: 12px;
            text-align: left;
          }
          th {
            background: ${isDark ? '#334155' : '#f1f5f9'};
            font-weight: bold;
          }
          a {
            color: #a855f7;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: bold;
          }
          h1 { font-size: 2em; border-bottom: 2px solid ${isDark ? '#475569' : '#e2e8f0'}; padding-bottom: 8px; }
          h2 { font-size: 1.5em; }
          h3 { font-size: 1.25em; }
        </style>
      `;

      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Markdown</title>
  ${styles}
</head>
<body>
  ${previewElement.innerHTML}
  <hr style="margin-top: 40px; border: none; border-top: 1px solid ${isDark ? '#475569' : '#e2e8f0'};">
  <p style="text-align: center; color: ${isDark ? '#64748b' : '#94a3b8'}; font-size: 14px;">
    Generated with <a href="https://webmarkdown.netlify.app/" style="color: #a855f7;">Markdown Previewer</a>
  </p>
</body>
</html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document-${Date.now()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onNotification?.('HTML exported successfully', 'success');
    } catch (error) {
      console.error('HTML export error:', error);
      onNotification?.('Failed to export HTML', 'error');
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  // Export as PDF
  const exportPDF = async () => {
    try {
      setIsExporting(true);

      const previewElement = document.querySelector('[data-preview-content]');
      if (!previewElement) {
        throw new Error('Preview content not found');
      }

      // Create a temporary container for better PDF rendering
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.width = '210mm'; // A4 width
      container.style.padding = '20mm';
      container.style.background = isDark ? '#1e293b' : '#ffffff';
      container.style.color = isDark ? '#e2e8f0' : '#1e293b';
      container.innerHTML = previewElement.innerHTML;
      document.body.appendChild(container);

      // Convert to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        logging: false,
      });

      // Remove temporary container
      document.body.removeChild(container);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Save PDF
      pdf.save(`document-${Date.now()}.pdf`);

      onNotification?.('PDF exported successfully', 'success');
    } catch (error) {
      console.error('PDF export error:', error);
      onNotification?.('Failed to export PDF', 'error');
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const exportOptions = [
    {
      id: 'markdown',
      label: 'Export as Markdown',
      icon: DocumentTextIcon,
      handler: exportMarkdown,
      color: 'text-blue-500',
    },
    {
      id: 'html',
      label: 'Export as HTML',
      icon: CodeBracketIcon,
      handler: exportHTML,
      color: 'text-orange-500',
    },
    {
      id: 'pdf',
      label: 'Export as PDF',
      icon: DocumentIcon,
      handler: exportPDF,
      color: 'text-red-500',
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
          isDark
            ? 'bg-slate-700 hover:bg-slate-600 active:bg-slate-500'
            : 'bg-slate-200 hover:bg-slate-300 active:bg-slate-400'
        } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Export options"
        aria-label="Export options"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline text-sm sm:text-base">
          {isExporting ? 'Exporting...' : 'Export'}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            className={`fixed inset-0 sm:absolute sm:left-auto sm:right-0 sm:inset-auto sm:mt-2 w-full sm:w-56 h-full sm:h-auto overflow-y-auto sm:rounded-lg shadow-lg z-50 ${
              isDark ? 'bg-slate-800 sm:border sm:border-slate-700' : 'bg-white sm:border sm:border-slate-200'
            }`}
          >
            {/* Mobile header with close button */}
            <div className={`sm:hidden sticky top-0 z-10 flex items-center justify-between p-4 border-b ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <h2 className="text-lg font-semibold">Export Options</h2>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
                }`}
                aria-label="Close"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="py-2">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={option.handler}
                  disabled={isExporting}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    isDark
                      ? 'hover:bg-slate-700 text-slate-200'
                      : 'hover:bg-slate-100 text-slate-800'
                  } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Icon className={`w-5 h-5 ${option.color}`} />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        </>
      )}
    </div>
  );
};

ExportMenu.propTypes = {
  markdown: PropTypes.string.isRequired,
  isDark: PropTypes.bool.isRequired,
  previewStyle: PropTypes.string,
  onNotification: PropTypes.func,
};

export default ExportMenu;
