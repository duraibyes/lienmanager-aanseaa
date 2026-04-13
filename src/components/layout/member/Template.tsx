import { useState } from 'react';
import NavigationHeader from './NavigationHeader';
import SideNavigation from './SideNavigation';
import Breadcrumbs from './Breadcrumbs';
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
      {/* HEADER */}
      {/* <NavigationHeader
        showLogo={true}
      /> */}
      <StickyTopBar />

      {/* BREADCRUMBS */}
      {/* <Breadcrumbs /> */}

      {/* CONTENT */}
      <main className="flex-1 overflow-auto px-4 sm:px-8 p-4 md:p-6">
        {props.content}
      </main>

      {/* SIDE NAVIGATION */}
      <SideNavigation
        isOpen={isSideNavOpen}
        onClose={() => setIsSideNavOpen(false)}
      />
    </div>
  );
};