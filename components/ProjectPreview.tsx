import React, { useState, useMemo, useEffect } from 'react';
import type { ProjectFile } from '../types';
import { CodeBlock } from './CodeBlock';
import { FileIcon } from './icons/FileIcon';
import { useI18n } from '../context/i18nContext';

interface ProjectPreviewProps {
  files: ProjectFile[];
}

export const ProjectPreview: React.FC<ProjectPreviewProps> = ({ files }) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  const { t } = useI18n();

  useEffect(() => {
    if (files.length > 0 && !files.some(f => f.path === selectedFilePath)) {
      setSelectedFilePath(files[0].path);
    }
  }, [files, selectedFilePath]);

  const selectedFile = useMemo(() => {
    return files.find(f => f.path === selectedFilePath) || null;
  }, [files, selectedFilePath]);

  useMemo(() => {
    const htmlFile = files.find(f => f.path.toLowerCase() === 'index.html');
    if (!htmlFile) {
        setPreviewHtml(null);
        if (activeTab === 'preview') setActiveTab('code');
        return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlFile.content, 'text/html');

    const inlineContent = (selector: string, attribute: string, createTag: string) => {
        doc.querySelectorAll(selector).forEach(el => {
            const path = el.getAttribute(attribute);
            if (path && !path.startsWith('http') && !path.startsWith('//')) {
                const normalizedPath = path.startsWith('./') ? path.substring(2) : path;
                const file = files.find(f => f.path === normalizedPath);
                if (file) {
                    const newEl = doc.createElement(createTag);
                    newEl.textContent = file.content;
                    el.parentNode?.replaceChild(newEl, el);
                }
            }
        });
    };
    
    inlineContent('link[rel="stylesheet"]', 'href', 'style');
    inlineContent('script[src]', 'src', 'script');

    setPreviewHtml(doc.documentElement.outerHTML);
  }, [files]);


  const renderCodeView = () => (
    <div className="flex flex-col md:flex-row h-full">
      <aside className="w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r border-gray-700/50 flex-shrink-0">
        <div className="p-4 bg-gray-900/50 border-b border-gray-700/50">
          <h3 className="text-lg font-semibold">{t('projectFiles')}</h3>
        </div>
        <nav className="p-2 space-y-1 overflow-y-auto max-h-60 md:max-h-[calc(60vh-121px)]">
          {files.map(file => (
            <button
              key={file.path}
              onClick={() => setSelectedFilePath(file.path)}
              className={`w-full text-left flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${
                selectedFilePath === file.path
                  ? 'bg-indigo-600/50 text-white'
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <FileIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{file.path}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        {selectedFile ? (
          <CodeBlock
            key={selectedFile.path}
            fileName={selectedFile.path}
            content={selectedFile.content}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>{t('selectFile')}</p>
          </div>
        )}
      </main>
    </div>
  );

  const renderPreviewView = () => {
    if (!previewHtml) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-8">
            <h3 className="text-xl font-semibold text-gray-300">{t('noPreviewAvailable')}</h3>
            <p className="mt-2">{t('noIndexHtml')}</p>
        </div>
      );
    }
    return (
        <iframe
            srcDoc={previewHtml}
            title="Project Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts"
        />
    );
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden min-h-[60vh] flex flex-col">
        <div className="flex border-b border-gray-700/50 flex-shrink-0">
            <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'code' ? 'bg-gray-700/50 text-white' : 'text-gray-400 hover:bg-gray-700/20'}`}
            >
                {t('codeTab')}
            </button>
            <button
                onClick={() => setActiveTab('preview')}
                disabled={!previewHtml}
                className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'preview' ? 'bg-gray-700/50 text-white' : 'text-gray-400 hover:bg-gray-700/20'} disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
            >
                {t('livePreviewTab')}
            </button>
        </div>
        <div className="flex-grow min-h-0">
            {activeTab === 'code' ? renderCodeView() : renderPreviewView()}
        </div>
    </div>
  );
};