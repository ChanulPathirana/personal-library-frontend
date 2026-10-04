import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-black text-white hover:bg-navy',
  secondary: 'bg-pale text-ink hover:bg-pale-strong',
  ghost: 'bg-transparent text-muted hover:bg-pale hover:text-ink',
  danger: 'bg-danger text-white hover:brightness-90',
}

export default function Button({
  variant = 'secondary',
  icon,
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex min-h-9 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
