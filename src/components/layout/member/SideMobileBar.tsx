import { useLocation, useNavigate } from "react-router-dom";
import { menuMobileSections } from "../../../utils/menu";
import { LogOut, X } from "lucide-react";
import { useAppDispatch } from "../../../store/hooks";
import { logout } from "../../../features/auth/authSlice";

type Props = {
    setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    profile: any;
}

const SideMobileBar = ({ setIsSideBarOpen, profile }: Props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const currentPath = location.pathname;

    const handleSignOut = () => {
        dispatch(logout());
        navigate('/');
        setIsSideBarOpen(false);
    };

    const handleProfile = () => {
        setIsSideBarOpen(false);
        navigate('/profile');
    }

    return (
        <aside className="fixed ltr:left-0 rtl:right-0 top-0 z-[9999] flex h-screen w-[260px] flex-col bg-gray-900 shadow-xl transition-transform duration-300 ease-in-out translate-x-0">
            <div className="flex h-16 items-center justify-between gap-3 border-b border-sidebar-border px-4">
                <div className="flex flex-col">
                    <span className="text-sm font-bold tracking-tight text-white">
                        Lien Manager
                    </span>
                    <span className="text-[10px] font-medium uppercase text-white">
                        Dashboard
                    </span>
                </div>
                <div>
                    <X onClick={() => setIsSideBarOpen(false)} className="text-white cursor-pointer" />
                </div>
            </div>
            <nav
                role="navigation"
                aria-label="Main navigation"
                className="flex-1 space-y-3 overflow-y-auto px-3 py-4"
            >
                <div>
                    <div className=" space-y-6">
                        {menuMobileSections.map((section, si) => (
                            <div key={si} className="space-y-3">
                                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider px-2">
                                    {section.title}
                                </h3>
                                <div className="space-y-1">
                                    {section.items.map((item) => {
                                        const isActive = currentPath === item.path;

                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => { navigate(item.path); setIsSideBarOpen(false) }}
                                                className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 group ${isActive
                                                    ? 'bg-primaryHover '
                                                    : 'hover:bg-gray-50/80 text-gray-900 hover:scale-[1.01]'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                                                    <span className={isActive ? 'text-white' : 'text-gray-400'}>
                                                        {item.label}
                                                    </span>
                                                </div>

                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </nav>
            <div className="border-t border-sidebar-border p-3">
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="w-full flex items-start justify-start gap-3 rounded-lg px-4 py-2 transition-colors"
                        onClick={handleProfile}
                    >
                        <div className="h-8 w-8 shrink-0 text-gray-400">
                            AS
                        </div>
                        <div className="flex flex-col w-full">
                            <span className="text-sm font-medium text-sidebar-foreground  text-gray-300">
                                {profile?.user_details?.first_name || 'Account'}
                            </span>
                            <span className="text-[11px] text-sidebar-foreground/50  text-gray-400">
                                Admin
                            </span>
                        </div>
                    </div>
                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </div>

        </aside>
    )
}

export default SideMobileBar