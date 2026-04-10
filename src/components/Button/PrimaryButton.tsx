type ButtonProps = {
    label: string;
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const PrimaryButton = ({
    label,
    loading,
    disabled,
    icon,
    ...props
}: ButtonProps) => {
    return (
        <button
            disabled={disabled || loading}
            className={`btn ${disabled || loading ? "btn-disabled" : "btn-primary"
                } shadow-md`}
            {...props}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    <span>{label}</span>
                    {icon && icon}
                </>
            )}
        </button>
    );
};