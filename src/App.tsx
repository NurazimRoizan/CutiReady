import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { HolidayConfigDrawer } from './components/HolidayConfigDrawer';

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <HomePage onOpenHolidayDrawer={() => setIsDrawerOpen(true)} />
      <HolidayConfigDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
