import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CalculatorKeyProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'operator' | 'primary' | 'destructive';
  className?: string;
  disabled?: boolean;
}

export function CalculatorKey({
  children,
  onClick,
  variant = 'default',
  className,
  disabled,
}: CalculatorKeyProps) {
  const variants = {
    default: 'calc-key',
    operator: 'calc-key-operator',
    primary: 'calc-key-primary',
    destructive: 'calc-key bg-destructive/20 text-destructive hover:bg-destructive/30',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        variants[variant],
        'h-14 text-lg select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}
