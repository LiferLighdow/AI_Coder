
import React, { useState, useCallback } from 'react';
import type { UploadedFile } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';
import { useI18n } from '../context/i18nContext';

interface ControlPanelProps {
  onGenerate: (prompt: string, language: string, files: UploadedFile[]) => void;
  isLoading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useI18n();

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const filePromises = Array.from(files).map(file => {
      return new Promise<UploadedFile>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve({ name: file.name, content: e.target?.result as string });
        reader.onerror = reject;
        reader.readAsText(file);
      });
    });

    try {
      const newFiles = await Promise.all(filePromises);
      setUploadedFiles(prev => [...prev, ...newFiles.filter(nf => !prev.some(ef => ef.name === nf.name))]);
    } catch (error) {
      console.error("Error reading files:", error);
      alert("There was an error reading one or more files.");
    }
  }, []);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && language.trim()) {
      onGenerate(prompt, language, uploadedFiles);
    } else {
      alert(t('formAlert'));
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">{t('promptLabel')}</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('promptPlaceholder')}
          className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          required
        />
      </div>
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">{t('languageLabel')}</label>
        <input
          type="text"
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder={t('languagePlaceholder')}
          className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('filesLabel')}</label>
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-32 px-4 transition bg-gray-900 border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none ${isDragging ? 'border-indigo-500' : 'border-gray-600'}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <span className="flex items-center space-x-2">
            <UploadIcon className="w-6 h-6 text-gray-400" />
            <span className="font-medium text-gray-400">
              {t('dropFiles')} <span className="text-indigo-400">{t('browse')}</span>
            </span>
          </span>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files)}
          />
        </label>
        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedFiles.map(file => (
              <div key={file.name} className="flex items-center justify-between bg-gray-700/50 p-2 rounded-md">
                <span className="text-sm font-mono truncate text-gray-300">{file.name}</span>
                <button type="button" onClick={() => removeFile(file.name)} className="p-1 text-gray-400 hover:text-red-400 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? t('generatingButton') : t('generateButton')}
      </button>
    </form>
  );
};
