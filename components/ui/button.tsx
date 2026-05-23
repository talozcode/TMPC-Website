import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'accent'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-ink text-canvas hover:bg-ink-secondary active:bg-ink-secondary',
  secondary:
    'border border-line text-ink hover:border-ink bg-transparent',
  accent:
    'bg-accent text-white hover:bg-accent-dark active:bg-accent-dark',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'text-sm px-4 py-2 rounded',
  md: 'text-sm px-5 py-2.5 rounded',
  lg: 'text-base px-6 py-3 rounded',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
