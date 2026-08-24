interface Props {
  name?: string | null;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  online?: boolean;
}

const Avatar = ({ name, src, size = "md", online = false }: Props) => {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };

  const initials =
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div className="relative shrink-0">
      {src ? (
        <img
          src={src}
          alt={name || "User"}
          className={`${sizes[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`
            ${sizes[size]}
            flex items-center justify-center
            rounded-full
            bg-blue-100
            font-semibold
            text-blue-600
          `}
        >
          {initials}
        </div>
      )}

      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
      )}
    </div>
  );
};

export default Avatar;
