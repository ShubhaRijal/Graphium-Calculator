import { cn } from '@/lib/utils';

interface GraphiumLogoProps {
  className?: string;
  size?: number;
}

export function GraphiumLogo({ className, size = 40 }: GraphiumLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background */}
      <rect width="40" height="40" rx="10" fill="hsl(var(--primary) / 0.1)" />
      
      {/* Grid lines */}
      <g stroke="hsl(var(--primary) / 0.3)" strokeWidth="0.5">
        <line x1="8" y1="10" x2="32" y2="10" />
        <line x1="8" y1="20" x2="32" y2="20" />
        <line x1="8" y1="30" x2="32" y2="30" />
        <line x1="10" y1="8" x2="10" y2="32" />
        <line x1="20" y1="8" x2="20" y2="32" />
        <line x1="30" y1="8" x2="30" y2="32" />
      </g>
      
      {/* Axes */}
      <g stroke="hsl(var(--primary))" strokeWidth="1.5">
        <line x1="8" y1="20" x2="32" y2="20" />
        <line x1="20" y1="8" x2="20" y2="32" />
      </g>
      
      {/* Graph curve (stylized G shape) */}
      <path
        d="M 12 14 Q 16 8, 24 10 Q 32 12, 30 20 Q 28 28, 20 28 L 20 22 L 26 22"
        stroke="url(#logoGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#glow)"
      />
      
      {/* Dots on the curve */}
      <circle cx="12" cy="14" r="2" fill="hsl(var(--primary))" />
      <circle cx="24" cy="10" r="2" fill="hsl(var(--primary))" />
      <circle cx="30" cy="20" r="2" fill="hsl(var(--accent))" />
      <circle cx="20" cy="28" r="2" fill="hsl(var(--accent))" />
    </svg>
  );
}
