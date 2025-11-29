import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  DocumentIcon,
  CodeBracketIcon,
  XMarkIcon,
  FolderArrowDownIcon,
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

const ExportMenu = ({ markdown, isDark, previewStyle, onNotification, tabs, activeTabId }) => {
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

  // Export as PDF - OPTIMIZED VERSION (Always white background)
  const exportPDF = async () => {
    try {
      setIsExporting(true);

      const previewElement = document.querySelector('[data-preview-content]');
      if (!previewElement) {
        throw new Error('Preview content not found');
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // Küçültülmüş margin
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);

      // Container - HER ZAMAN BEYAZ
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-99999px';
      container.style.width = '750px';
      container.style.padding = '38px';
      container.style.boxSizing = 'border-box';
      container.style.background = '#ffffff'; // HER ZAMAN BEYAZ
      container.style.color = '#1e293b'; // HER ZAMAN KOYU METİN
      container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      container.style.fontSize = '8px'; // 8px FONT
      container.style.lineHeight = '1.4';

      // İçeriği klonla
      const content = previewElement.cloneNode(true);
      
      // TÜM ELEMENTLERİ BEYAZ TEMA İÇİN DÜZENLEYİP
      const allElements = content.querySelectorAll('*');
      allElements.forEach(el => {
        el.style.color = '#1e293b'; // Koyu metin
        el.style.backgroundColor = 'transparent';
        
        // Code blokları için açık gri arka plan
        if (el.tagName === 'PRE' || el.tagName === 'CODE') {
          el.style.backgroundColor = '#f1f5f9';
          el.style.color = '#1e293b';
        }
        
        // Linkler için mor renk
        if (el.tagName === 'A') {
          el.style.color = '#a855f7';
        }
        
        // Tablolar için border
        if (el.tagName === 'TH' || el.tagName === 'TD') {
          el.style.borderColor = '#cbd5e1';
        }
        if (el.tagName === 'TH') {
          el.style.backgroundColor = '#f1f5f9';
        }
        
        // Blockquote için açık gri
        if (el.tagName === 'BLOCKQUOTE') {
          el.style.color = '#64748b';
          el.style.borderLeftColor = '#a855f7';
        }
      });
      
      // Başlıkları küçült
      const headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(h => {
        const currentSize = parseFloat(window.getComputedStyle(h).fontSize);
        h.style.fontSize = (currentSize * 0.85) + 'px';
        h.style.marginTop = '12px';
        h.style.marginBottom = '8px';
        h.style.color = '#1e293b';
      });

      // Paragrafları optimize et
      const paragraphs = content.querySelectorAll('p, li');
      paragraphs.forEach(p => {
        p.style.marginTop = '6px';
        p.style.marginBottom = '6px';
        p.style.color = '#1e293b';
      });

      container.appendChild(content);
      document.body.appendChild(container);

      await new Promise(resolve => setTimeout(resolve, 600));

      // Render - HER ZAMAN BEYAZ ARKA PLAN
      const fullCanvas = await html2canvas(container, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#ffffff', // HER ZAMAN BEYAZ
        logging: false,
        windowWidth: container.scrollWidth,
        windowHeight: container.scrollHeight,
      });

      document.body.removeChild(container);

      // Sayfalama
      const canvasWidth = fullCanvas.width;
      const canvasPageHeight = (contentHeight / contentWidth) * canvasWidth;
      
      let currentY = 0;
      let pageNum = 0;

      while (currentY < fullCanvas.height) {
        if (pageNum > 0) {
          pdf.addPage();
        }

        const remainingHeight = fullCanvas.height - currentY;
        const thisPageHeight = Math.min(canvasPageHeight, remainingHeight);

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = thisPageHeight;
        
        const ctx = pageCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff'; // HER ZAMAN BEYAZ
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        ctx.drawImage(
          fullCanvas,
          0, currentY,
          canvasWidth, thisPageHeight,
          0, 0,
          canvasWidth, thisPageHeight
        );

        const imgData = pageCanvas.toDataURL('image/png', 0.95);
        const pdfImgHeight = (thisPageHeight / canvasWidth) * contentWidth;
        
        pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, pdfImgHeight);

        currentY += thisPageHeight;
        pageNum++;
      }

      pdf.save(`document-${Date.now()}.pdf`);
      onNotification?.('PDF oluşturuldu - sayfa geçişlerinde küçük kesintiler olabilir', 'success');

    } catch (error) {
      console.error('PDF export error:', error);
      onNotification?.('PDF oluşturulamadı: ' + error.message, 'error');
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  // Batch Export All Tabs as ZIP
  const exportAllTabsAsZip = async () => {
    try {
      if (!tabs || tabs.length === 0) {
        onNotification?.('No tabs to export', 'error');
        return;
      }

      setIsExporting(true);
      const zip = new JSZip();

      // Add each tab as a markdown file
      tabs.forEach((tab, index) => {
        const fileName = `${tab.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
        zip.file(fileName, tab.content);
      });

      // Add a README with metadata
      const readme = `# Markdown Export
Exported on: ${new Date().toLocaleString()}
Total tabs: ${tabs.length}

## Files:
${tabs.map((tab, i) => `${i + 1}. ${tab.name}`).join('\n')}
`;
      zip.file('README.md', readme);

      // Generate ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Download
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `markdown-export-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onNotification?.(`Exported ${tabs.length} tabs successfully`, 'success');
    } catch (error) {
      console.error('Batch export error:', error);
      onNotification?.('Failed to export tabs', 'error');
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

  // Add batch export option if multiple tabs exist
  const batchExportOption = tabs && tabs.length > 1 ? {
    id: 'batch-zip',
    label: `Export All Tabs (${tabs.length}) as ZIP`,
    icon: FolderArrowDownIcon,
    handler: exportAllTabsAsZip,
    color: 'text-purple-500',
    badge: tabs.length,
  } : null;

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

            {/* Batch Export Option (if multiple tabs) */}
            {batchExportOption && (
              <>
                <div className={`mx-4 my-2 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`} />
                <button
                  key={batchExportOption.id}
                  onClick={batchExportOption.handler}
                  disabled={isExporting}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    isDark
                      ? 'hover:bg-slate-700 text-slate-200'
                      : 'hover:bg-slate-100 text-slate-800'
                  } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <batchExportOption.icon className={`w-5 h-5 ${batchExportOption.color}`} />
                  <span className="text-sm font-medium flex-1">{batchExportOption.label}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    isDark ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {batchExportOption.badge}
                  </span>
                </button>
              </>
            )}
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
  tabs: PropTypes.array,
  activeTabId: PropTypes.string,
};

export default ExportMenu;