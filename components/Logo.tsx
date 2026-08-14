type LogoProps = {
  variant?: "full" | "icon";
  tone?: "dark" | "light";
  size?: "sm" | "lg";
  showTagline?: boolean;
  className?: string;
};

const iconSizes = { sm: 32, lg: 72 };
const wordmarkClasses = {
  sm: "text-xl",
  lg: "text-3xl sm:text-4xl",
};

export default function Logo({
  variant = "full",
  tone = "dark",
  size = "sm",
  showTagline = false,
  className = "",
}: LogoProps) {
  const textColor = tone === "light" ? "text-white" : "text-ink";
  const taglineColor = tone === "light" ? "text-white/60" : "text-ink/50";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={iconSizes[size]}
        height={iconSizes[size]}
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="20" cy="20" r="19" fill="#101828" />
        <circle
          cx="20"
          cy="20"
          r="15"
          fill="none"
          stroke="#4E7FDB"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="75.4 18.8"
          transform="rotate(-90 20 20)"
        />
        <circle
          cx="20"
          cy="20"
          r="10.5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="52.8 13.2"
          transform="rotate(30 20 20)"
        />
        <circle
          cx="20"
          cy="20"
          r="6"
          fill="none"
          stroke="#C1272D"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="30.2 7.5"
          transform="rotate(150 20 20)"
        />
      </svg>

      {variant === "full" && (
        <div className="flex flex-col leading-tight">
          <span className={`font-display font-semibold tracking-tight ${wordmarkClasses[size]} ${textColor}`}>
            La Expansión
          </span>
          {showTagline && (
            <span className={`text-xs font-medium uppercase tracking-[0.15em] ${taglineColor}`}>
              Movimiento político
            </span>
          )}
        </div>
      )}
    </div>
  );
}