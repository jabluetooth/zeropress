export default function AnimatedGradientText({
  children,
  colorFrom = '#ffaa40',
  colorTo = '#9c40ff',
  speed = 1,
  className = '',
}) {
  return (
    <span
      className={`animated-gradient-text ${className}`}
      style={{
        '--bg-size': `${speed * 300}%`,
        '--color-from': colorFrom,
        '--color-to': colorTo,
      }}
    >
      {children}
    </span>
  );
}
