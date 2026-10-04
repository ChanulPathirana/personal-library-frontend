import type { ReadingStatus } from '../../types/library'

const styles: Record<ReadingStatus, { label: string; color: string }> = {
  TO_READ: { label: 'To Read', color: 'bg-badge-toread' },
  READING: { label: 'Reading', color: 'bg-badge-reading' },
  COMPLETED: { label: 'Completed', color: 'bg-badge-completed' },
}

export default function StatusBadge({ status }: { status: ReadingStatus }) {
  const style = styles[status]
  return <span className={'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs text-ink ' + style.color}>
    {status === 'COMPLETED' ? '✓' : <span className="h-1.5 w-1.5 rounded-full bg-ink/50" />}
    {style.label}
  </span>
}
