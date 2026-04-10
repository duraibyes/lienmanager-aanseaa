import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, ChevronRight, LogOut, UserRound, Compass, Home, FolderPlus, FolderOpen, Clock, CheckSquare, Calculator, Brain, Sparkles, FileType, UserRound as UserIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logout } from '../../../features/auth/authSlice';
import { setView } from '../../../store/slices/viewSlice';
import { useGetProfileQuery } from '../../../features/lienAuth/profileApi';

interface SideNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuSections = [
  {
    title: 'Overview',
    items: [
      { id: 'home', label: 'Home', icon: Home, path: '/dashboard' }
    ]
  },
  {
    title: 'Project Hub',
    items: [
      { id: 'new_projects', label: 'Create Project', icon: FolderPlus, path: '/project/create' },
      { id: 'recent_projects', label: 'Project List', icon: FolderOpen, path: '/projects' }
    ]
  },
  {
    title: 'Operations',
    items: [
      { id: 'deadlines', label: 'Timeline Manager', icon: Clock, path: '/deadlines' },
      { id: 'tasks', label: 'Task Tracker', icon: CheckSquare, path: '/tasks' }
    ]
  },
  {
    title: 'Utilities',
    items: [
      { id: 'quick_remedies', label: 'Smart Calculator', icon: Calculator, path: '/quick-remedies' }
    ]
  },
  {
    title: 'Contact Center',
    items: [
      { id: 'contacts', label: 'Contacts', icon: UserIcon, path: '/customer-contacts' },
      { id: 'documents', label: 'Documents', icon: FileType, path: '/documents' }
    ]
  },
  {
    title: 'Insights',
    items: [
      { id: 'ai_insights', label: 'AI Analytics', icon: Brain, path: '/' }
    ]
  },
  {
    title: 'Support',
    items: [
      { id: 'onboarding_demo', label: 'Guided Tour', icon: Sparkles, path: '/tour' }
    ]
  }
];

export default function SideNavigation({ isOpen, onClose }: SideNavigationProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAppSelector((state) => state.auth);
  const currentPath = location.pathname;
  const { data: profileData } = useGetProfileQuery();
  const profile = profileData?.data || null;

  const sideNavRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    dispatch(setView(null));
    dispatch(logout());
    navigate("/");
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sideNavRef.current && !sideNavRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* MODERN DROPDOWN PANEL */}
      <div
        ref={sideNavRef}
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] z-50 transform transition-all duration-300 ease-out ${
          isOpen ? 'translate-x-0 scale-100' : 'translate-x-full scale-95'
        }`}
      >
        {/* GLASSMORPHISM CONTAINER */}
        <div className="h-full bg-gradient-to-br from-white/95 via-white/90 to-white/95 backdrop-blur-2xl border-l border-white/30 shadow-2xl relative overflow-hidden flex flex-col">
          {/* DECORATIVE GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0075be]/5 via-transparent to-[#00aeea]/5 pointer-events-none" />

          {/* HEADER */}
          <div className="relative flex items-center justify-between p-6 border-b border-gray-100/50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0075be] to-[#00aeea] flex items-center justify-center">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 tracking-tight">Navigation</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100/80 transition-all duration-200 hover:scale-105"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* USER PROFILE SECTION */}
            <div className="p-6 border-b border-gray-100/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center font-bold shadow-lg text-lg">
                  {profile?.user_details?.image ? (
                    <img
                      src={profile.user_details.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-[#0075be] to-[#00aeea] text-white flex items-center justify-center">
                      {auth?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-base font-semibold text-gray-800 truncate">
                    {profile?.user?.name || auth?.user?.name || "User"}
                  </span>
                  <span className="text-sm text-gray-500 truncate">
                    {profile?.user?.email || auth?.user?.email || "user@email.com"}
                  </span>
                </div>
              </div>

              {/* PROFILE ACTIONS */}
              <div className="space-y-2">
                <button
                  onClick={() => handleNavigate('/profile')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-50/80 group"
                >
                  <UserRound className="w-5 h-5 text-gray-500 group-hover:text-[#0075be]" />
                  <span className="text-gray-700">Profile Settings</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* MENU SECTIONS */}
            <div className="p-4 space-y-6">
              {menuSections.map((section, si) => (
                <div key={si} className="space-y-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = currentPath === item.path;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigate(item.path)}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                            isActive
                              ? 'bg-gradient-to-r from-[#0075be] to-[#00aeea] text-white shadow-lg scale-[1.02]'
                              : 'hover:bg-gray-50/80 text-gray-700 hover:scale-[1.01]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                            <span className={isActive ? 'text-white' : 'text-gray-700'}>
                              {item.label}
                            </span>
                          </div>
                          <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                            isActive ? 'text-white' : 'text-gray-400'
                          }`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER - Always Visible */}
          <div className="flex-shrink-0 p-4 border-t border-gray-100/50 bg-gray-50/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50/80 transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
              <ChevronRight className="w-4 h-4 text-red-400 ml-auto group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
