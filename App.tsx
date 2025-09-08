
import React, { useState, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { ProjectPreview } from './components/ProjectPreview';
import { Loader } from './components/Loader';
import { generateProject } from './services/geminiService';
import type { ProjectFile, UploadedFile } from './types';
import { useI18n } from './context/i18nContext';

const App: React.FC = () => {
  const [generatedFiles, setGeneratedFiles] = useState<ProjectFile[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  const handleGenerate = useCallback(async (prompt: string, language: string, files: UploadedFile[]) => {
    setIsLoading(true);
    setError(null);
    setGeneratedFiles(null);

    try {
      const result = await generateProject(prompt, language, files);
      setGeneratedFiles(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
            {t('appTitle')}
          </h1>
          <p className="text-center text-gray-400 mt-1">
            {t('appSubtitle')}
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700/50">
          <ControlPanel onGenerate={handleGenerate} isLoading={isLoading} />
        </div>

        <div className="mt-8">
          {isLoading && <Loader />}
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p className="font-bold">{t('errorTitle')}</p>
              <p>{error}</p>
            </div>
          )}
          {generatedFiles && !isLoading && <ProjectPreview files={generatedFiles} />}
          {!generatedFiles && !isLoading && !error && (
            <div className="text-center text-gray-500 py-16 border-2 border-dashed border-gray-700 rounded-lg">
              <h2 className="text-2xl font-semibold">{t('previewHeader')}</h2>
              <p className="mt-2">{t('previewSubtitle')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
