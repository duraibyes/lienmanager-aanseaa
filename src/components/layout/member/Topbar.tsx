import { Plus, Search, X } from "lucide-react";
import LogoImg from "../../../../public/logo.png";
import { useState } from "react";

type Props = {
    setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar = ({ setIsSideBarOpen }: Props) => {
    const [search, setSearch] = useState("");
    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
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
                <button
                    aria-label="User menu"
                    className="ms-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                    type="button"
                    id="radix-_r_4_"
                    aria-haspopup="menu"
                    aria-expanded="false"
                    data-state="closed"
                    data-slot="dropdown-menu-trigger"
                >
                    AS
                </button>
            </div>
        </header>
    )
}

export default Topbar