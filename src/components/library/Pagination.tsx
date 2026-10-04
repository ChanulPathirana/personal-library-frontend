import Button from '../common/Button'
import Icon from '../common/Icon'

interface PaginationProps {
  page: number
  totalPages: number
  totalElements: number
  pageSize: number
  onChange: (page: number) => void
}

export default function Pagination({ page, totalPages, totalElements, pageSize, onChange }: PaginationProps) {
  if (totalElements === 0) return null
  const start = page * pageSize + 1
  const end = Math.min((page + 1) * pageSize, totalElements)
  const visiblePages = Array.from(new Set([0, page - 1, page, page + 1, totalPages - 1]))
    .filter((value) => value >= 0 && value < totalPages)
    .sort((a, b) => a - b)

  return (
    <div className="flex flex-col gap-3 border-t border-pale px-5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p>Showing <strong>{start}–{end}</strong> of <strong>{totalElements}</strong> items</p>
      <nav aria-label="Library pages" className="flex items-center gap-1">
        <Button variant="ghost" disabled={page === 0} onClick={() => onChange(page - 1)} className="px-2" icon={<Icon name="chevron_left" />}>Previous</Button>
        {visiblePages.map((value, index) => (
          <span key={value} className="flex items-center gap-1">
            {index > 0 && value - visiblePages[index - 1] > 1 && <span className="px-1 text-muted">…</span>}
            <button type="button" onClick={() => onChange(value)} aria-label={'Page ' + (value + 1)} aria-current={value === page ? 'page' : undefined} className={['min-w-9 rounded-lg px-2 py-2 text-xs', value === page ? 'bg-black text-white' : 'hover:bg-pale'].join(' ')}>{value + 1}</button>
          </span>
        ))}
        <Button variant="ghost" disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)} className="px-2">Next <Icon name="chevron_right" /></Button>
      </nav>
    </div>
  )
}
