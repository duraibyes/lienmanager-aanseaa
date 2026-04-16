
import { useLocation } from "react-router-dom"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    FileText,
    Calendar,
    CheckSquare,
    Calculator,
    BookOpen,
    HelpCircle,
    User,
    Settings,
    LogOut,
    Menu,
    ChevronDown,
    Scale
} from "lucide-react"
import { Link } from "react-router-dom"

const mainNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/contacts", label: "Contacts", icon: Users },
    { href: "/documents", label: "Documents", icon: FileText },
    { href: "/deadlines", label: "Deadlines", icon: Calendar },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
]

const moreNavItems = [
    { href: "/quick-calculation", label: "Quick Deadline Calculation", icon: Calculator },
    { href: "/knowledge-base", label: "Knowledge Base", icon: BookOpen },
    { href: "/help", label: "Help", icon: HelpCircle },
]

const userNavItems = [
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
]

export function Header() {
    const location = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)

    const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + "/")

    return (
        <header className="sticky top-0 z-50 w-full glass border-b">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg gradient-primary glow-primary">
                            <Scale className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-serif font-bold text-xl text-foreground">LienPilot</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                    isActive(item.href)
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}

                        {/* More Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2 text-muted-foreground">
                                    More
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                {moreNavItems.map((item) => (
                                    <DropdownMenuItem key={item.href} asChild>
                                        <Link to={item.href} className="flex items-center gap-2">
                                            <item.icon className="h-4 w-4" />
                                            {item.label}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>

                    {/* User Menu - Desktop */}
                    <div className="hidden lg:flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                                        <User className="h-4 w-4 text-primary-foreground" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                {userNavItems.map((item) => (
                                    <DropdownMenuItem key={item.href} asChild>
                                        <Link to={item.href} className="flex items-center gap-2">
                                            <item.icon className="h-4 w-4" />
                                            {item.label}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to="/" className="flex items-center gap-2 text-destructive">
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild className="lg:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <nav className="flex flex-col gap-1 mt-8">
                                {mainNavItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                            isActive(item.href)
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                ))}

                                <div className="h-px bg-border my-2" />

                                {moreNavItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                            isActive(item.href)
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                ))}

                                <div className="h-px bg-border my-2" />

                                {userNavItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                            isActive(item.href)
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                ))}

                                <Link
                                    to="/"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Logout
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
