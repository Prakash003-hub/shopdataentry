import React, { useRef } from 'react';
import { Upload, Camera, FileText, X, Image as ImageIcon } from 'lucide-react';

export default function FileUpload({ files, setFiles, disabled }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const processFiles = (selectedFiles) => {
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFiles((prev) => [
          ...prev,
          {
            name: file.name,
            mimeType: file.type,
            size: file.size,
            base64: reader.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        Upload Documents (Images / PDFs)
      </label>

      {/* Dropzone & Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Gallery / File Picker */}
        <div
          onClick={() => !disabled && fileInputRef.current.click()}
          className={`border-2 border-dashed border-slate-200 hover:border-green-500 bg-slate-50/70 hover:bg-green-50/40 p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
            disabled ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <Upload className="w-6 h-6 text-green-600 mb-1" />
          <span className="text-xs font-bold text-slate-700">Choose Files / Gallery</span>
          <span className="text-[10px] text-slate-400">Multiple JPG, PNG, PDF supported</span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Camera Capture */}
        <div
          onClick={() => !disabled && cameraInputRef.current.click()}
          className={`border-2 border-dashed border-slate-200 hover:border-blue-500 bg-slate-50/70 hover:bg-blue-50/40 p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
            disabled ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <Camera className="w-6 h-6 text-blue-600 mb-1" />
          <span className="text-xs font-bold text-slate-700">Take Photo (Camera)</span>
          <span className="text-[10px] text-slate-400">Snap document directly</span>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Attached Files List */}
      {files && files.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-bold text-slate-500">
            Selected Files ({files.length}):
          </div>
          <div className="grid grid-cols-1 gap-2">
            {files.map((file, idx) => {
              const isImage = file.mimeType.startsWith('image/') || file.base64.startsWith('data:image');
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    {isImage ? (
                      <img
                        src={file.base64}
                        alt="thumb"
                        className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                    )}
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-800 truncate">{file.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
