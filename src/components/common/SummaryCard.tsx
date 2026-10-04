import Icon from './Icon'

interface SummaryCardProps {
  label: string
  value: number
  icon: string
  note: string
}

export default function SummaryCard({ label, value, icon, note }: SummaryCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs uppercase tracking-wide text-muted">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-badge-toread text-ink"><Icon name={icon} /></span>
      </div>
      <p className="mt-2 font-display text-4xl leading-none">{value}</p>
      <p className="mt-3 text-sm text-muted">{note}</p>
    </div>
  )
}
