import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, className = "", ...props }: Props) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`
          w-full rounded-xl border
          px-4 py-3 text-sm
          outline-none transition
          placeholder:text-gray-400
          focus:ring-2
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
          }
          ${className}
        `}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
