import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FileText, Sparkles } from 'lucide-react';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ImageUploader = ({ onImageSelect, selectedSubtest, selectedModel, onGenerate, isGenerating }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFiles = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles).slice(0, MAX_FILES);
    const validFiles = [];
    
    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} terlalu besar (max 5MB)`);
        continue;
      }
      
      const isImage = file.type.startsWith('image/');
      
      if (!isImage) {
        alert(`File ${file.name} tidak didukung. Hanya gambar.`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (validFiles.length === 0) return;
    
    const processedFiles = [];
    let processed = 0;
    
    validFiles.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        processedFiles[idx] = {
          name: file.name,
          type: file.type,
          data: reader.result,
          isImage: true
        };
        processed++;
        
        if (processed === validFiles.length) {
          setFiles(processedFiles);
          onImageSelect(processedFiles);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) processFiles(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    
    const pastedFiles = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) pastedFiles.push(file);
      }
    }
    
    if (pastedFiles.length > 0) processFiles(pastedFiles);
  };

  const handleRemove = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onImageSelect(newFiles.length > 0 ? newFiles : null);
  };
  
  const handleRemoveAll = () => {
    setFiles([]);
    onImageSelect(null);
  };

  return (
    <div className="space-y-4" onPaste={handlePaste}>
      {files.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 transition-all text-center cursor-pointer ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50 scale-105'
              : 'border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/50'
          }`}
        >
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload size={32} className="text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-slate-700 mb-1">Upload, Drag & Drop, atau Paste (Ctrl+V)</p>
          <p className="text-xs text-slate-500">PNG, JPG (Max 5 files, 5MB each)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">{files.length} file dipilih</span>
            <button
              onClick={handleRemoveAll}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium"
            >
              Hapus Semua
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {files.map((file, idx) => (
              <div key={idx} className="relative border-2 border-indigo-200 rounded-xl overflow-hidden bg-slate-50">
                {file.isImage && (
                  <img src={file.data} alt={file.name} className="w-full h-32 object-cover" />
                )}
                <button
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-all shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <button
          onClick={onGenerate}
          disabled={isGenerating || !selectedSubtest || !selectedModel}
          className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isGenerating || !selectedSubtest || !selectedModel
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600 shadow-lg'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Menganalisis...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Generate dari Gambar</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
