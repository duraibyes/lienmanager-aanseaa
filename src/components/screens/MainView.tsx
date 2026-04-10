import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setView } from "../../store/slices/viewSlice";

const MainView = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleMemberView = () => {
        dispatch(setView("member"));
        navigate("/login");
    };

    const handleAttorneyView = () => {
        dispatch(setView("attorney"));
        navigate("/attorney/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
            <div className="max-w-5xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-3">
                        Welcome to Lien Manager
                    </h1>
                    <p className="text-lg text-slate-600">
                        Please select your view to continue
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <button
                        onClick={handleMemberView}
                        className="bg-white rounded-xl border-2 border-slate-200 p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 text-left group">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-users w-10 h-10 text-blue-600 group-hover:text-white transition-colors"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                Members View
                            </h2>
                            <div className="space-y-3 text-sm text-slate-600">
                                <p className="leading-relaxed">
                                    Perfect for contractors, subcontractors, and suppliers
                                    managing construction projects and payment rights.
                                </p>
                                <div className="pt-4 border-t border-slate-200">
                                    <ul className="space-y-2 text-left">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            <span>Create and manage construction projects</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            <span>Track lien and bond claim deadlines</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            <span>Manage contacts and documents</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            <span>Calculate payment remedies</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 font-bold">•</span>
                                            <span>Generate compliance documents</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-8 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg group-hover:bg-blue-600 transition-colors">
                                Continue as Member
                            </div>
                        </div>
                    </button>
                    <button
                        onClick={handleAttorneyView}
                        className="bg-white rounded-xl border-2 border-slate-200 p-8 hover:border-slate-700 hover:shadow-xl transition-all duration-300 text-left group">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-slate-700 transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-scale w-10 h-10 text-slate-700 group-hover:text-white transition-colors"
                                >
                                    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
                                    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
                                    <path d="M7 21h10"></path>
                                    <path d="M12 3v18"></path>
                                    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                Attorney View
                            </h2>
                            <div className="space-y-3 text-sm text-slate-600">
                                <p className="leading-relaxed">
                                    Designed for construction attorneys managing multiple client
                                    cases and legal proceedings.
                                </p>
                                <div className="pt-4 border-t border-slate-200">
                                    <ul className="space-y-2 text-left">
                                        <li className="flex items-start gap-2">
                                            <span className="text-slate-700 font-bold">•</span>
                                            <span>Manage multiple client portfolios</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-slate-700 font-bold">•</span>
                                            <span>Track case deadlines and filings</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-slate-700 font-bold">•</span>
                                            <span>Access legal templates and forms</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-slate-700 font-bold">•</span>
                                            <span>Review state-specific lien laws</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-slate-700 font-bold">•</span>
                                            <span>Generate legal documentation</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-8 px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg group-hover:bg-slate-800 transition-colors">
                                Continue as Attorney
                            </div>
                        </div>
                    </button>
                </div>
                <div className="mt-12 text-center">
                    <p className="text-sm text-slate-500">
                        You can change your view anytime from the settings menu
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MainView;
