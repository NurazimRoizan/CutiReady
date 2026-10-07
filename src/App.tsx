import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { HowToUseModal } from './components/HowToUseModal';

export default function App() {
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);

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
