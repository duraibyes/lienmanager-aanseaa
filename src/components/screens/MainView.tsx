import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

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
        <div className="min-h-screen mx-auto bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="">

                <div className="grid grid-cols-1 gap-8">

                    <button
                        onClick={handleMemberView}
                        className="bg-white rounded-xl border-2 border-slate-200 p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 text-left group">
                        <div className="flex flex-col sm:flex-row items-center  justify-between gap-6">
                            <div className="flex flex-col items-center justify-center">

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
                                        className="lucide lucide-users w-10 h-10 text-primary group-hover:text-white transition-colors"
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
                            </div>
                            <div className="space-y-3 text-sm text-slate-600">
                                <p className="text-primary font-bold">
                                    Built for contractors, subcontractors, and suppliers to manage projects, track payments, and stay compliant with ease.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4 pt-3">
                                    {[
                                        "Manage projects",
                                        "Track deadlines",
                                        "Organize contacts",
                                        "Handle payments",
                                        "Generate documents",
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 text-slate-700">
                                            <Check className="w-4 h-4 text-primary" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-end mt-8 px-6 py-3 bg-primary text-white font-semibold rounded-lg group-hover:bg-blue-600 transition-colors">
                                Enter as Member
                            </div>
                        </div>
                    </button>
                    <div className="text-center flex items-center justify-center flex-col py-6">
                        <h1 className="text-4xl font-bold text-slate-900 mb-3">
                            Welcome to Lien Manager
                        </h1>

                        <p className="text-lg text-slate-600 mb-4">
                            Choose your workspace to get started
                        </p>

                        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                    </div>
                    <button
                        onClick={handleAttorneyView}
                        className="bg-white rounded-xl border-2 border-slate-200 p-8 hover:border-slate-700 hover:shadow-xl transition-all duration-300 text-left group">
                        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-6">
                            <div className="flex flex-col items-center justify-center">
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
                            </div>
                            <div className="space-y-3 text-sm text-slate-600">
                                <p className="leading-relaxed font-bold">
                                    Designed for attorneys handling multiple clients, cases, and legal workflows with efficiency and clarity.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4 pt-3">
                                    {[
                                        "Manage clients",
                                        "Track cases",
                                        "Access templates",
                                        "Stay compliant",
                                        "Generate documents",
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 text-slate-700">
                                            <Check className="w-4 h-4 text-primary" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-8 px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg group-hover:bg-slate-800 transition-colors">
                                Enter as Attorney
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
