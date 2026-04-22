import { useCallback, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut, User, Scale, Menu, FolderKanban } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setView } from "../../../store/slices/viewSlice";
import { logout } from "../../../features/auth/authSlice";
import { RootState } from "../../../store";
import { cn } from "@/lib/utils";

type TemplateProps = {
    readonly children: React.ReactNode;
    readonly currentPage: 'dashboard' | 'projects' | 'profile';
}

export default function Template({ children, currentPage }: TemplateProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useSelector((state: RootState) => state.auth);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSignOut = useCallback(() => {
        dispatch(setView(null));
        dispatch(logout());
        navigate("/");
    }, [dispatch, navigate]);

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
        
            <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex h-16 items-center justify-between">
                        
                
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20">
                                <Scale className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-serif font-bold text-xl text-slate-900 tracking-tight">Lien Pilot</span>
                        </div>

                        <nav className="hidden md:flex items-center gap-1">
                            <button
                                onClick={() => navigate("/attorney/dashboard")}
                                className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all",
                                currentPage === "dashboard"
                                ? "bg-[#f8e9cd] text-[#d0744b] shadow-sm" // Light tan background with the brown text
                                : "text-slate-600 hover:text-[#d0744b] hover:bg-[#f8e9cd]/50" // Muted slate with subtle hover
                                     )}
                                    >
                                    <LayoutDashboard className="w-4 h-4" />
                                  Dashboard
                                </button>
                        </nav>

              
                        <div className="flex items-center gap-3">
                            <div 
                                onClick={() => navigate("/attorney/profile")}
                                className="hidden md:flex items-center gap-3 px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-100 cursor-pointer transition-all pr-4"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                                    {auth?.user?.image ? (
                                        <img src={auth.user.image} alt="P" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="h-4 w-4 text-white" />
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-900 leading-none">{auth?.user?.name || 'Attorney'}</span>
                                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Portal</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSignOut}
                                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>

                            <button
                                className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
                                onClick={() => setMobileOpen(!mobileOpen)}
                            >
                                <Menu className="w-6 h-6 text-slate-600" />
                            </button>
                        </div>
                    </div>
                </div>

         
                {mobileOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 p-4 space-y-2 animate-in slide-in-from-top-2">
                        <button
                            onClick={() => { navigate("/attorney/dashboard"); setMobileOpen(false); }}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                currentPage === 'dashboard' ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            <LayoutDashboard className="h-5 w-5" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => { navigate("/attorney/profile"); setMobileOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            <User className="h-5 w-5 text-slate-400" />
                            My Profile
                        </button>
                        <div className="h-px bg-slate-100 my-2" />
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl"
                        >
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </button>
                    </div>
                )}
            </header>

            <main className="flex-1 container mx-auto py-8 px-4 md:px-6 animate-in fade-in duration-500">
                {children}
            </main>
        </div>
    );
}