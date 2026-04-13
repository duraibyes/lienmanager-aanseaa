import React from "react";
import clsx from "clsx";

type IconButtonProps = {
  icon: React.ElementType;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  title?: string;
};

const variantStyles = {
  primary:
    "bg-primary text-white hover:bg-primary/90 shadow-sm",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100",
  danger:
    "bg-red-100 text-red-600 hover:bg-red-200",
};

const sizeStyles = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
};

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  variant = "ghost",
  size = "md",
  className,
  title,
}) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={clsx(
        "flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
};

export default IconButton;