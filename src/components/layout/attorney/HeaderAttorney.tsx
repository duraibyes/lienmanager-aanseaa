
import { useLocation, useNavigate } from "react-router-dom"
import { useCallback, useState } from "react"
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
    User,
    LogOut,
    Menu,
    Scale
} from "lucide-react"
import { Link } from "react-router-dom"
import { logout } from "@/features/auth/authSlice"
import { useDispatch } from "react-redux"

const mainNavItems = [
    { href: "/attorney/dashboard", label: "Dashboard", icon: LayoutDashboard },
]

const userNavItems = [
    { href: "/attorney/profile", label: "Profile", icon: User },
]

export function HeaderAttorney() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false)

    const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + "/");

    const handleSignOut = useCallback(() => {
        console.log(' logout clicked')
        dispatch(logout());
        navigate('/');
        setMobileOpen(false);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b">
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
                    </nav>

                    {/* User Menu - Desktop */}
                    <div className="hidden lg:flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="hidden">
                                <Button>More</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuTrigger >
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                                        <User className="h-4 w-4 text-primary-foreground" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-white">
                                {userNavItems.map((item) => (
                                    <DropdownMenuItem key={item.href} asChild>
                                        <Link to={item.href} className="flex items-center gap-2 cursor-pointer">
                                            <item.icon className="h-4 w-4" />
                                            {item.label}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <button onClick={handleSignOut} className="flex items-center gap-2 w-full cursor-pointer">
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
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

                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Logout
                                </button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
