/** Line-art desk globe for “country / world” steps — gold accent (#E9C153) to match wallet modal icons. */
const GOLD = "#E9C153";

export function DeskGlobeIcon({
  className,
  color = GOLD,
}: {
  className?: string;
  /** Stroke/fill accent (defaults to GOLD) */
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 40 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Meridian ring */}
      <ellipse
        cx="20"
        cy="13.5"
        rx="11.5"
        ry="10.5"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      {/* Latitude hint */}
      <path
        d="M9 13.5h22"
        stroke={color}
        strokeWidth="0.85"
        strokeOpacity="0.35"
        strokeLinecap="round"
      />
      {/* Longitude curves */}
      <path
        d="M14 5.5c-2 4-2 8.5 0 12.5 1.8 3.5 4.2 5.2 6 5.8"
        stroke={color}
        strokeWidth="0.85"
        strokeOpacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M26 5.5c2 4 2 8.5 0 12.5-1.8 3.5-4.2 5.2-6 5.8"
        stroke={color}
        strokeWidth="0.85"
        strokeOpacity="0.4"
        strokeLinecap="round"
      />
      {/* Simplified continents (fills read as “land”) */}
      <path
        d="M12.5 11.2c1.8-2 4.5-1.2 6.2 0.5 1.2 1.3 0.8 3.5-1 4.2-2 .8-4-1-5.2-2.8-.7-1.9 0-2 .5-2Z"
        fill={color}
        fillOpacity="0.22"
      />
      <path
        d="M22.5 10c2.6-0.6 5.2 0.8 5.8 3.2 0.4 1.7-1 3.4-3.4 3.6-2.8.2-4.8-2-2.4-6.8Z"
        fill={color}
        fillOpacity="0.18"
      />
      <path
        d="M16 17.2c2.2 1.4 4.8 1.6 7 .4 1-0.6 1.8-1.4 2.6-2.2"
        stroke={color}
        strokeWidth="0.9"
        strokeOpacity="0.25"
        strokeLinecap="round"
      />
      {/* Axis caps */}
      <circle cx="20" cy="3.25" r="0.9" fill={color} />
      <circle cx="20" cy="23.75" r="0.9" fill={color} />
      {/* Stand */}
      <path
        d="M20 24.25v3.2"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M13.5 29.75h13"
        stroke={color}
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M15 27.4h10"
        stroke={color}
        strokeWidth="1.1"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
