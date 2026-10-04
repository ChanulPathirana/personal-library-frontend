import type { ItemType } from '../../types/library'

const labels: Record<ItemType, string> = {
  BOOK: 'Book',
  PDF: 'PDF',
  PAPER: 'Paper',
  NOTE: 'Note',
}

const colors: Record<ItemType, string> = {
  BOOK: 'bg-badge-reading',
  PDF: 'bg-pale-mid',
  PAPER: 'bg-pale-strong',
  NOTE: 'bg-badge-toread',
}

export default function TypeBadge({ type }: { type: ItemType }) {
  return <span className={'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium text-ink ' + colors[type]}>{labels[type]}</span>
}
