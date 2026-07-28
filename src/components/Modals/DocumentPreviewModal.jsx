import React from 'react';
import { X, ExternalLink, Download, FileText } from 'lucide-react';

export default function DocumentPreviewModal({ docUrl, docName, onClose }) {
  if (!docUrl) return null;

  const isPdf = docUrl.includes('.pdf') || (docName && docName.toLowerCase().endsWith('.pdf'));
  const isImage = docUrl.startsWith('data:image') || docUrl.includes('.jpg') || docUrl.includes('.jpeg') || docUrl.includes('.png') || docUrl.includes('.webp');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 truncate pr-4">
            <FileText className="w-5 h-5 text-green-600 shrink-0" />
            <h3 className="font-bold text-slate-800 text-sm truncate">{docName || 'Document Preview'}</h3>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={docUrl}
              download={docName || 'Document'}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 bg-slate-900/5 p-4 flex items-center justify-center overflow-auto">
          {isImage ? (
            <img
              src={docUrl}
              alt={docName}
              className="max-w-full max-h-full object-contain rounded-xl shadow-md"
            />
          ) : isPdf ? (
            <iframe
              src={docUrl}
              title={docName}
              className="w-full h-full rounded-xl border border-slate-200"
            />
          ) : (
            <div className="text-center p-8">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 text-sm font-semibold mb-4">
                Preview not available directly in browser for this file type.
              </p>
              <a
                href={docUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white font-bold text-xs py-2.5 px-5 rounded-2xl shadow-md shadow-green-600/30"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open File in Google Drive</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
