import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  subtitle: string
  actions?: ReactNode
}

export default function PageHeader({ eyebrow, title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-xs uppercase tracking-[0.12em] text-muted">{eyebrow}</p>}
        <h1 className="font-display text-4xl leading-tight text-ink">{title}</h1>
        <p className="mt-1 text-base text-muted">{subtitle}</p>
      </div>
      {actions}
    </div>
  )
}
