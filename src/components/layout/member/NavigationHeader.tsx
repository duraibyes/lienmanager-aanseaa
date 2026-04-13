import { useState, useRef, useEffect } from 'react';
import {
  Plus, Menu, UserRound, Home, FolderKanban,
  Clock, CheckCircle2, Calculator, LogOut, ChevronUp, ChevronDown,
  Contact2, Files, History
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetProfileQuery } from '../../../features/lienAuth/profileApi';
import { useAppDispatch } from '../../../store/hooks';
import { logout } from '../../../features/auth/authSlice';

export default function NavigationHeader({ showLogo = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: profileData } = useGetProfileQuery();
  const profile = profileData?.data || null;
  const dispatch = useAppDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (path: string) => {
    navigate(path);
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/');
    setProfileOpen(false);
  };

  return (
    <div className="sticky top-0 z-[100] backdrop-blur-xl bg-gradient-to-r from-[#005a92] to-[#0087b7] border-b border-white/10 shadow-lg">
      <div className="flex items-center justify-between px-4 sm:px-8 py-2.5">

        <div className="flex items-center gap-4">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 border ${menuOpen ? 'bg-white text-[#005a92] border-white' : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
                }`}
            >
              <Menu className="w-5 h-5" />
              <ChevronUp className={`w-4 h-4 transition-transform duration-300 ${menuOpen ? '' : 'rotate-180'}`} />
            </button>

            {menuOpen && (
              <div className="absolute left-0 mt-3 w-[85vw] sm:w-72 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 py-3 animate-in fade-in zoom-in-95 duration-200 origin-top-left overflow-y-auto max-h-[80vh]">
                <div className="px-2 space-y-1">
                  <MenuLink icon={Home} label="Home" active={location.pathname === '/dashboard'} onClick={() => handleNav('/dashboard')} />
                  <MenuLink icon={Plus} label="Create Project" active={false} onClick={() => handleNav('/project/create')} />

                  <div className="h-px bg-slate-50 my-2 mx-4" />

                  {/* CONTACTS (Main Page) */}
                  <MenuLink icon={Contact2} label="Contacts" active={location.pathname === '/customer-contacts'} onClick={() => handleNav('/customer-contacts')} />

                  {/* RECENT CONTACTS (Specific History Page) */}
                  <MenuLink icon={History} label="All Contacts" active={location.pathname === '/contacts'} onClick={() => handleNav('/contacts')} />

                  <MenuLink icon={Files} label="Documents" active={location.pathname === '/documents'} onClick={() => handleNav('/documents')} />

                  <div className="h-px bg-slate-50 my-2 mx-4" />

                  <MenuLink icon={FolderKanban} label="Projects" active={location.pathname === '/projects'} onClick={() => handleNav('/projects')} />
                  <MenuLink icon={Clock} label="Due Dates" active={location.pathname === '/deadlines'} onClick={() => handleNav('/deadlines')} />
                  <MenuLink icon={CheckCircle2} label="Tasks" active={location.pathname === '/tasks'} onClick={() => handleNav('/tasks')} />
                  <MenuLink icon={Calculator} label="Remedial Actions" active={location.pathname === '/quick-remedies'} onClick={() => handleNav('/quick-remedies')} />
                </div>
              </div>
            )}
          </div>

          {showLogo && (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>

              <p className="text-white font-medium">Lien Manager</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* <button
            onClick={() => handleAddProject(navigate)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white text-[#005a92] rounded-xl font-semibold shadow-md hover:scale-105 transition-all duration-300 text-sm md:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">New Project</span>
          </button> */}

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 pr-2 sm:pr-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-white text-[#005a92] flex items-center justify-center font-bold shadow-inner overflow-hidden text-sm">
                {profile?.user_details?.image ? (
                  <img src={profile.user_details.image} alt="P" className="w-full h-full object-cover" />
                ) : (
                  profile?.user_details?.first_name?.charAt(0) || "U"
                )}
              </div>
              <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-white/70 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* PROFILE DROPDOWN */}
            {profileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800 truncate">{profile?.user_details?.first_name || 'Account'}</p>
                  {/* <p className="text-xs text-slate-500 truncate">{profile?.user_details?.email}</p> */}
                </div>
                <div className="p-2">
                  <button onClick={() => handleNav('/profile')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                    <UserRound className="w-4 h-4 text-slate-400" /> My Profile
                  </button>
                  <div className="h-px bg-slate-100 my-1 mx-2" />
                  <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuLink({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${active
        ? 'bg-blue-50 text-blue-600'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
      <span className="text-[15px] font-medium">{label}</span>
    </button>
  );
}