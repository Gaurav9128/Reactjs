const toneClasses = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

const Avatar = ({ name = "?", size = 36, className = "" }) => {
  const initials =
    String(name || "?")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?";

  const tone =
    toneClasses[Math.abs(String(name).charCodeAt(0) || 0) % toneClasses.length];

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={`
        rounded-full ${tone} ${className}
        flex items-center justify-center font-bold shrink-0
      `}
    >
      {initials}
    </div>
  );
};

export default Avatar;