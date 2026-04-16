import { Scale } from "lucide-react";
import { Link } from "react-router-dom";

export const AuthLeftPanel = () => {
    return (
        <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
                <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#auth-grid)" />
                </svg>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
                <div className="max-w-md text-center space-y-8">
                    <Link to="/" className="inline-flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-primary glow-primary">
                            <Scale className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-serif font-bold text-3xl text-white">LienPilot</span>
                    </Link>

                    <h1 className="text-3xl font-serif font-bold text-white text-balance">
                        Manage Your Construction Liens with Confidence
                    </h1>

                    <p className="text-white/70 text-lg leading-relaxed">
                        Track deadlines, organize documents, and ensure compliance with state-specific lien laws
                        all in one powerful platform.
                    </p>

                    <div className="flex flex-col gap-4 pt-4">
                        <div className="flex items-center gap-3 text-white/80">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="text-sm font-semibold">1</span>
                            </div>
                            <span>Never miss critical deadlines</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/80">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="text-sm font-semibold">2</span>
                            </div>
                            <span>Keep all documents organized</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/80">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="text-sm font-semibold">3</span>
                            </div>
                            <span>Stay compliant with ease</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};