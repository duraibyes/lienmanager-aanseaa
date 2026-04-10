type AuthLeftPanelProps = {
    title: string;
    subtitle: string;
    footer?: React.ReactNode;
};

export const AuthLeftPanel = ({
    title,
    subtitle,
    footer,
}: AuthLeftPanelProps) => {
    return (
        <div className="auth-left">
            <div></div>

            {/* Content */}
            <div className="flex items-center justify-center">
                <div className="max-w-md">
                    <h2 className="auth-title">{title}</h2>
                    <p className="auth-subtitle">{subtitle}</p>
                </div>
            </div>

            {/* Decorative Blurs */}
            <div className="auth-blur-top" />
            <div className="auth-blur-bottom" />

            {/* Footer */}
            <div className="auth-footer">
                {footer}
            </div>
        </div>
    );
};