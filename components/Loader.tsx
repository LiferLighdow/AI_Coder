
import React from 'react';
import { useI18n } from '../context/i18nContext';

export const Loader: React.FC = () => {
  const { t } = useI18n();
  
  const messages = React.useMemo(() => [
    t('loaderMessage1'),
    t('loaderMessage2'),
    t('loaderMessage3'),
    t('loaderMessage4'),
    t('loaderMessage5'),
    t('loaderMessage6'),
  ], [t]);

  const [message, setMessage] = React.useState(messages[0]);

  React.useEffect(() => {
    setMessage(messages[0]);

    const intervalId = setInterval(() => {
      setMessage(prev => {
        const currentIndex = messages.indexOf(prev);
        const safeCurrentIndex = currentIndex === -1 ? 0 : currentIndex;
        const nextIndex = (safeCurrentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2500);

    return () => clearInterval(intervalId);
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-lg">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-300 transition-opacity duration-500">{message}</p>
      <p className="text-gray-500 mt-1">{t('loaderWait')}</p>
    </div>
  );
};
