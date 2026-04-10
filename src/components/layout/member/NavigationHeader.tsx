import { useCallback } from 'react';
import { Plus, Menu, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { handleAddProject } from '../../../utils/navigation';
import { useGetProfileQuery } from '../../../features/lienAuth/profileApi';

interface NavigationHeaderProps {
  readonly showLogo?: boolean;
  readonly onMenuClick: () => void;
}

export default function NavigationHeader({
  showLogo = false,
  onMenuClick,
}: NavigationHeaderProps) {
  const navigate = useNavigate();
  const { data: profileData } = useGetProfileQuery();
  const profile = profileData?.data || null;

  const handleAddProjectClick = useCallback(() => {
    handleAddProject(navigate);
  }, [navigate]);

  const handleProfileClick = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  return (
    <div className="sticky top-0 z-[40] isolation-isolate backdrop-blur-xl bg-gradient-to-r from-[#0075be]/95 to-[#00aeea]/95 border-b border-white/20 shadow-xl">
      {/* HEADER */}
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* LOGO */}
          {showLogo && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-white font-bold text-base md:text-lg tracking-wide">
                Optrixx
              </span>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* ADD PROJECT BUTTON */}
          <button
            onClick={handleAddProjectClick}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#0075be] rounded-xl font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Project</span>
          </button>

          {/* PROFILE ICON */}
          <button
            onClick={handleProfileClick}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105 overflow-hidden"
            title="Profile"
          >
            {profile?.user_details?.image ? (
              <img
                src={profile.user_details.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserRound className="w-5 h-5 text-white" />
            )}
          </button>

          {/* MENU BUTTON */}
          <button
            onClick={onMenuClick}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}