import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, User, Scale, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setView } from "../../../store/slices/viewSlice";
import { logout } from "../../../features/auth/authSlice";
import { RootState } from "../../../store";


type TemplateProps = {
    readonly children: React.ReactNode;
    readonly currentPage: 'dashboard' | 'projects' | 'profile';
}

export default function Template({ children, currentPage }: TemplateProps) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector((state: RootState) => state.auth);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSignOut = useCallback(() => {
        dispatch(setView(null));
        dispatch(logout());
        navigate("/");
    }, []);
    return (
        <div className="h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`
  fixed md:relative
  top-0 left-0
  h-screen
  w-64
  bg-white border-r border-gray-200
  flex flex-col
  z-40
  transform transition-transform duration-300
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0
  md:transform-none
  `}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Scale className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Lien Manager</h1>
                            <p className="text-xs text-gray-500">Attorney Portal</p>
                        </div>
                    </div>

                    {/* Close button mobile */}
                    <button
                        className="md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => navigate("/attorney/dashboard")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentPage === "dashboard"
                                    ? "bg-blue-50 text-blue-700 font-medium"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                Dashboard
                            </button>
                        </li>

                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 sm:text-center">
                    <div className="flex items-center sm:justify-center gap-3 mb-3 px-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {auth?.user?.image ? (
                                <img
                                    src={auth.user.image}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-6 h-6 text-blue-600" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {auth?.user?.name}
                            </p>
                            <p className="text-xs text-gray-500">{auth?.user?.lien?.role_name ?? ''}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/attorney/profile")}
                        className="w-full flex items-center justify-start mb-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg text-left"
                    >
                        View Profile
                    </button>

                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-start gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>
            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="min-h-screen">
                    {/* Mobile Header */}
                    <header className="md:hidden flex items-center justify-between bg-white border-b px-4 py-3">
                        <button onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>

                        <h1 className="text-lg font-semibold">Lien Manager</h1>
                    </header>
                    <main className="">{children}</main>
                </div>
            </div>
        </div>
    );
}