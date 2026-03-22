export function Spotlight({ className = '', fill = 'black' }) {
  return (
    <svg
      className={`spotlight ${className}`}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="spotlight-grad">
          <stop offset="0%" stopColor={fill} stopOpacity="0.12" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="512" cy="512" r="512" fill="url(#spotlight-grad)" />
    </svg>
  );
}
