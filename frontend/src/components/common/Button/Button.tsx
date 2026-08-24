import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button = ({
  children,
  loading = false,
  disabled,
  className = "",
  ...props
}: Props) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        flex w-full items-center
        justify-center rounded-xl
        bg-blue-600 px-4 py-3
        text-sm font-semibold
        text-white transition
        hover:bg-blue-700
        focus:outline-none
        focus:ring-2
        focus:ring-blue-200
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;
