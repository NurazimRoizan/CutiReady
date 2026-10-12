import { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { HowToUseModal } from './components/HowToUseModal';
import { useLeaveStore, isEnglishPath } from './store/useLeaveStore';

export default function App() {
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
  const setLanguage = useLeaveStore((state) => state.setLanguage);

  useEffect(() => {
    const handlePopState = () => {
      setLanguage(isEnglishPath() ? 'en' : 'manglish');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setLanguage]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <HomePage onOpenHowToUse={() => setIsHowToUseOpen(true)} />

      <HowToUseModal
        isOpen={isHowToUseOpen}
        onClose={() => setIsHowToUseOpen(false)}
      />
    </div>
  );
}

