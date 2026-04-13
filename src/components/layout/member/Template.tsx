import { useState } from 'react';
import SideNavigation from './SideNavigation';
import StickyTopBar from './StickyTopBar';

interface TemplateProps {
  content: React.ReactNode;
  wizardMode?: boolean;
  saveAndExit?: () => void;
  saveAndExitDisabled?: boolean;
}

export const Template = (props: TemplateProps) => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-slate-50 ">
      <StickyTopBar />
      <main className="p-6">
        {props.content}
      </main>
      <SideNavigation
        isOpen={isSideNavOpen}
        onClose={() => setIsSideNavOpen(false)}
      />
    </div>
  );
};