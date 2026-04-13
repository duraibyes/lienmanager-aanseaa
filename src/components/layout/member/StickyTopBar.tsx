import { ChevronDown } from "lucide-react";

import { useEffect, useRef, useState } from "react";
import LinkButton from "../../Button/LinkButton";
import { useNavigate } from "react-router-dom";
import SideMobileBar from "./SideMobileBar";
import { useGetProfileQuery } from "../../../features/lienAuth/profileApi";
import Topbar from "./Topbar";

const StickyTopBar = () => {

    const ref = useRef<HTMLDivElement>(null);
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const navigate = useNavigate();

    const { data: profileData } = useGetProfileQuery();
    const profile = profileData?.data || null;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsToolsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="sticky top-0 ">
            <Topbar setIsSideBarOpen={setIsSideBarOpen} />
            <nav
                role="navigation"
                aria-label="Main navigation"
                className="hidden border-b border-border bg-gray-100  md:block sm:px-12 px-4"
            >
                <div className="flex h-11 items-center gap-1">
                    <div className="flex items-center gap-3">
                        <LinkButton
                            to="/dashboard"
                            label="Overview"
                            isActive={false}
                        />
                        <div className="mx-1 hidden h-6 w-px bg-border sm:block"></div>
                        <LinkButton
                            to="/projects"
                            label="Projects"
                            isActive={false}
                        />
                        <div className="mx-1 hidden h-6 w-px bg-border sm:block"></div>
                        <LinkButton
                            to="/contacts"
                            label="Contacts"
                            isActive={false}
                        />
                        <div className="mx-1 hidden h-6 w-px bg-border sm:block"></div>
                        <LinkButton
                            to="/documents"
                            label="Documents"
                            isActive={false}
                        />
                        <div className="mx-1 hidden h-6 w-px bg-border sm:block"></div>
                        <div className="relative" ref={ref}>
                            <button
                                className="flex items-center gap-1 rounded-md px-3 py-1.5 text-md font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
                                onClick={() => setIsToolsOpen(!isToolsOpen)}
                            >
                                Tools
                                <ChevronDown
                                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isToolsOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {isToolsOpen && (
                                <div className="absolute right-0  w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-2">
                                        <button
                                            onClick={() => navigate("/tasks")}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                                        >
                                            Tasks
                                        </button>
                                        <button
                                            onClick={() => navigate("/deadlines")}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                                        >
                                            Deadlines
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1"></div>
                    <LinkButton
                        to="/quick-remedies"
                        label="Quick Actions"
                    />
                </div>
            </nav>
            {isSideBarOpen && (
                <SideMobileBar setIsSideBarOpen={setIsSideBarOpen} profile={profile} />
            )}
        </div>
    );
};

export default StickyTopBar;
