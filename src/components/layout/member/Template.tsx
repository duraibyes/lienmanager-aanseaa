import { useState } from 'react';
import StickyTopBar from './StickyTopBar';
import SideMobileBar from './SideMobileBar';
import { useGetProfileQuery } from '../../../features/lienAuth/profileApi';

interface TemplateProps {
  content: React.ReactNode;
  wizardMode?: boolean;
  saveAndExit?: () => void;
  saveAndExitDisabled?: boolean;
}

export const Template = (props: TemplateProps) => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const { data: profileData } = useGetProfileQuery();
  const profile = profileData?.data || null;


  return (
    <div className="h-screen flex flex-col bg-slate-50 ">
      <StickyTopBar openSidebar={() => setIsSideNavOpen(true)} />
      <main className="p-6">
        {props.content}
      </main>
      {/* <SideNavigation
        isOpen={isSideNavOpen}
        onClose={() => setIsSideNavOpen(false)}
      /> */}
      {isSideNavOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[1300]"
            onClick={() => setIsSideNavOpen(false)}
          />

          <div className="fixed top-0 left-0 z-[1400]">
            <SideMobileBar
              setIsSideBarOpen={setIsSideNavOpen}
              profile={profile}
            />
          </div>
        </>
      )}
    </div>
  );
};