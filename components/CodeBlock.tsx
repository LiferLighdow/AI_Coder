
import React, { useState } from 'react';
import { useI18n } from '../context/i18nContext';

interface CodeBlockProps {
  fileName: string;
  content: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ fileName, content }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { t } = useI18n();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert(t('copyFail'));
    }
  };

  return (
    <div className="bg-gray-900/50 h-full flex flex-col">
      <div className="flex justify-between items-center p-3 border-b border-gray-700/50 flex-shrink-0">
        <p className="font-mono text-sm text-gray-400">{fileName}</p>
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-xs font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
        >
          {isCopied ? t('copied') : t('copy')}
        </button>
      </div>
      <div className="overflow-auto flex-1">
        <pre className="p-4 text-sm whitespace-pre-wrap break-words">
          <code className="font-mono">{content}</code>
        </pre>
      </div>
    </div>
  );
};
