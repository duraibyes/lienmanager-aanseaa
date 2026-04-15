
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    Scale,
    Shield,
    Clock,
    FileCheck,
    Building2,
    Gavel,
    ArrowRight,
    CheckCircle2,
    Users,
    Briefcase
} from "lucide-react"
import { setView } from "@/store/slices/viewSlice";

const memberFeatures = [
    {
        icon: Clock,
        title: "Never Miss Deadlines",
        description: "Automated tracking and reminders for all critical construction lien deadlines"
    },
    {
        icon: FileCheck,
        title: "Document Management",
        description: "Organize and access all project documents, notices, and legal paperwork in one place"
    },
    {
        icon: Building2,
        title: "Project Tracking",
        description: "Monitor multiple construction projects with comprehensive dashboards and reports"
    },
    {
        icon: Shield,
        title: "Compliance Assurance",
        description: "Stay compliant with state-specific lien laws and notice requirements"
    }
]

const attorneyFeatures = [
    {
        icon: Gavel,
        title: "Case Management",
        description: "Efficiently manage multiple lien cases with integrated tools and workflows"
    },
    {
        icon: Users,
        title: "Client Portal",
        description: "Provide clients with secure access to case status, documents, and communications"
    },
    {
        icon: FileCheck,
        title: "Document Automation",
        description: "Generate legal notices and filings with customizable templates"
    },
    {
        icon: Clock,
        title: "Deadline Calendar",
        description: "Track all case deadlines with automatic alerts and calendar integration"
    }
]

const benefits = [
    "State-specific lien law compliance",
    "Automated deadline calculations",
    "Secure document storage",
    "Real-time project tracking",
    "Notice generation tools",
    "Comprehensive reporting"
]

export default function LandingPage() {

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
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden gradient-hero min-h-[90vh] flex items-center">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

                <div className="container mx-auto px-4 md:px-6 py-20 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        {/* Logo */}
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-dark border border-white/10">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-primary glow-primary">
                                <Scale className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-serif font-bold text-2xl text-white">LienPilot</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight text-balance">
                            Master Construction Lien{" "}
                            <span className="text-transparent bg-clip-text gradient-accent bg-gradient-to-r from-primary to-accent">
                                Compliance
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed text-pretty">
                            The smart platform for managing construction liens, notices, deadlines, and documentation.
                            Never miss a critical deadline again.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button size="lg" onClick={handleMemberView} className="w-full sm:w-auto text-lg px-8 py-6 gradient-primary hover:opacity-90 glow-primary">
                                <Briefcase className="mr-2 h-5 w-5" />
                                Member Portal
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button onClick={handleAttorneyView} size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/30 hover:text-white">
                                <Gavel className="mr-2 h-5 w-5" />
                                Attorney Portal
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="pt-8 flex flex-wrap gap-6 justify-center text-white/50 text-sm">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                Trusted by 1,000+ contractors
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                50+ states supported
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                99.9% uptime
                            </span>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path
                            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
                            className="fill-background"
                        />
                    </svg>
                </div>
            </section>

            {/* Why LienPilot Section */}
            <section className="py-20 md:py-32 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-sm font-semibold text-primary uppercase tracking-wider">Why Choose LienPilot</span>
                        <h2 className="mt-4 text-3xl md:text-4xl font-serif font-bold text-foreground text-balance">
                            The Complete Solution for Construction Lien Management
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground text-pretty">
                            Whether you&apos;re a contractor, subcontractor, supplier, or attorney, LienPilot streamlines
                            your construction lien process from start to finish.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-4 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-medium text-foreground">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Member Portal Features */}
            <section className="py-20 md:py-32 bg-muted/30">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="space-y-8">
                            <div>
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                    <Briefcase className="h-4 w-4" />
                                    For Contractors & Suppliers
                                </span>
                                <h2 className="mt-4 text-3xl md:text-4xl font-serif font-bold text-foreground text-balance">
                                    Member Portal
                                </h2>
                                <p className="mt-4 text-lg text-muted-foreground text-pretty">
                                    Manage your construction projects, track deadlines, and ensure compliance with
                                    state-specific lien laws all in one powerful platform.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {memberFeatures.map((feature, index) => (
                                    <div key={index} className="space-y-3">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <feature.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="font-semibold text-foreground">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    </div>
                                ))}
                            </div>

                            <Button onClick={handleMemberView} size="lg" className="gradient-primary hover:opacity-90 glow-primary">
                                Access Member Portal
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>

                        {/* Visual Element */}
                        <div className="relative">
                            <div className="aspect-square rounded-2xl gradient-hero p-8 flex items-center justify-center">
                                <div className="w-full max-w-sm space-y-4">
                                    {/* Mock Dashboard Cards */}
                                    <div className="glass rounded-xl p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm ">Active Projects</span>
                                            <Building2 className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="text-3xl font-bold text-primary">24</span>
                                    </div>
                                    <div className="glass rounded-xl p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm ">Upcoming Deadlines</span>
                                            <Clock className="h-4 w-4 text-accent" />
                                        </div>
                                        <span className="text-3xl font-bold text-primary">7</span>
                                    </div>
                                    <div className="glass rounded-xl p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm ">Compliance Rate</span>
                                            <Shield className="h-4 w-4 text-green-400" />
                                        </div>
                                        <span className="text-3xl font-bold text-primary">98%</span>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative */}
                            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-2xl border-2 border-primary/20" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Attorney Portal Features */}
            <section className="py-20 md:py-32 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Visual Element */}
                        <div className="relative order-2 lg:order-1">
                            <div className="aspect-square rounded-2xl bg-secondary p-8 flex items-center justify-center">
                                <div className="w-full max-w-sm space-y-4">
                                    {/* Mock Attorney Dashboard */}
                                    <div className="bg-card rounded-xl p-4 space-y-2 shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Active Cases</span>
                                            <Gavel className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="text-3xl font-bold text-foreground">156</span>
                                    </div>
                                    <div className="bg-card rounded-xl p-4 space-y-2 shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Pending Filings</span>
                                            <FileCheck className="h-4 w-4 text-accent" />
                                        </div>
                                        <span className="text-3xl font-bold text-foreground">23</span>
                                    </div>
                                    <div className="bg-card rounded-xl p-4 space-y-2 shadow-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Client Satisfaction</span>
                                            <Users className="h-4 w-4 text-green-600" />
                                        </div>
                                        <span className="text-3xl font-bold text-foreground">4.9/5</span>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative */}
                            <div className="absolute -z-10 -top-6 -left-6 w-full h-full rounded-2xl border-2 border-primary/20" />
                        </div>

                        <div className="space-y-8 order-1 lg:order-2">
                            <div>
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                                    <Gavel className="h-4 w-4" />
                                    For Legal Professionals
                                </span>
                                <h2 className="mt-4 text-3xl md:text-4xl font-serif font-bold text-foreground text-balance">
                                    Attorney Portal
                                </h2>
                                <p className="mt-4 text-lg text-muted-foreground text-pretty">
                                    Streamline your construction lien practice with powerful case management tools,
                                    document automation, and client communication features.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {attorneyFeatures.map((feature, index) => (
                                    <div key={index} className="space-y-3">
                                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                                            <feature.icon className="h-6 w-6 text-secondary-foreground" />
                                        </div>
                                        <h3 className="font-semibold text-foreground">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    </div>
                                ))}
                            </div>

                            <Button onClick={handleAttorneyView} size="lg" variant="secondary" className="hover:opacity-90">
                                Access Attorney Portal
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-32 gradient-hero relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid2)" />
                    </svg>
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white text-balance">
                            Ready to Take Control of Your Lien Management?
                        </h2>
                        <p className="text-lg text-white/70 text-pretty">
                            Join thousands of construction professionals who trust LienPilot to protect their rights
                            and streamline their compliance processes.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-white text-secondary hover:bg-white/90">
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/40 hover:text-white">
                                Contact Sales
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-secondary">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-primary">
                                <Scale className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-serif font-bold text-lg text-secondary-foreground">LienPilot</span>
                        </div>


                        <p className="text-sm text-gray-400">
                            &copy; {new Date().getFullYear()} LienPilot. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
