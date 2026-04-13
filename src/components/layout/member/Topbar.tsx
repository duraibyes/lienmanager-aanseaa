import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus, Search, UserRound, X } from "lucide-react";
import LogoImg from "../../../../public/logo.png";
import { useGetProfileQuery } from "../../../features/lienAuth/profileApi";
import { logout } from "../../../features/auth/authSlice";
import { useAppDispatch } from "../../../store/hooks";

type Props = {
    setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar = ({ setIsSideBarOpen }: Props) => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    const { data: profileData } = useGetProfileQuery();
    const profile = profileData?.data || null;

    const handleNav = (path: string) => {
        navigate(path);
        setProfileOpen(false);
    };

    const handleSignOut = () => {
        dispatch(logout());
        navigate('/');
        setProfileOpen(false);
    };

    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-12">
            <div className="flex items-center gap-3">
                <button
                    aria-label="Open menu"
                    onClick={() => setIsSideBarOpen(true)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-menu h-5 w-5"
                        aria-hidden="true"
                    >
                        <path d="M4 5h16"></path>
                        <path d="M4 12h16"></path>
                        <path d="M4 19h16"></path>
                    </svg>
                </button>
                <div className="hidden items-center gap-2.5 md:flex">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                        <img src={LogoImg} alt="logo" style={{ filter: "invert(1)" }} />
                    </div>
                    <span className=" font-bold tracking-tight">
                        Lien Manager
                    </span>
                    <div className="mx-1 h-6 w-px bg-border"></div>
                </div>
                <div
                    className={`flex items-center gap-2 flex-1 min-w-[200px] h-[38px] px-3 mr-2 bg-slate-50 border border-slate-200 rounded-lg`}
                >
                    <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search anything…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    className="items-center justify-center whitespace-nowrap font-medium transition-all disabled:pointer-events-none 
                        disabled:opacity-50 shrink-0 outline-none  bg-primary text-textOnPrimary hover:bg-primary/90 rounded-md px-3 gap-1.5 h-8 sm:inline-flex"
                >
                    <Plus className="w-8 h-6" />
                    <span className="hidden sm:inline">Create Project</span>
                </button>
                <div className="mx-1 hidden h-6 w-px bg-border sm:block"></div>

                <button
                    aria-label="Notifications"
                    className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded="false"
                    aria-controls="radix-_r_3_"
                    data-state="closed"
                    data-slot="popover-trigger"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-bell h-4 w-4"
                        aria-hidden="true"
                    >
                        <path d="M10.268 21a2 2 0 0 0 3.464 0"></path>
                        <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path>
                    </svg>
                    <span className="absolute ltr:right-1.5 rtl:left-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive"></span>
                </button>
                <div className="flex items-end justify-end">
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center justify-end gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
                        >
                            <div className="w-8 h-8 rounded-full bg-white text-[#005a92] flex items-center justify-end font-bold shadow-inner overflow-hidden text-sm">
                                {profile?.user_details?.image ? (
                                    <img src={profile.user_details.image} alt="P" className="w-full h-full object-cover" />
                                ) : (
                                    profile?.user_details?.first_name?.charAt(0) || "U"
                                )}
                            </div>
                        </button>

                        {profileOpen && (
                            <div className="absolute z-40 right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

                                <div className="p-2">
                                    <div className="px-5 py-4 ">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{profile?.user_details?.first_name || 'Account'}</p>
                                        {/* <p className="text-xs text-slate-500 truncate">{profile?.user_details?.email}</p> */}
                                    </div>
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
        </header>
    )
}

export default Topbar