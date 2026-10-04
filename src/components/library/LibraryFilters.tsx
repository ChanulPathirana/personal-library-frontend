import type { LibrarySort } from '../../api/libraryApi'
import type { ItemType, ReadingStatus } from '../../types/library'
import Button from '../common/Button'
import Icon from '../common/Icon'

export type TypeFilter = ItemType | ''
export type StatusFilter = ReadingStatus | ''

interface LibraryFiltersProps {
  title: string
  type: TypeFilter
  status: StatusFilter
  sort: LibrarySort
  onTitleChange: (value: string) => void
  onTypeChange: (value: TypeFilter) => void
  onStatusChange: (value: StatusFilter) => void
  onSortChange: (value: LibrarySort) => void
  onAdd: () => void
}

const selectClass = 'h-10 rounded-xl bg-pale px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-accent/30'

export default function LibraryFilters(props: LibraryFiltersProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm xl:flex-row xl:items-center">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <label className="relative min-w-48 flex-1">
          <span className="sr-only">Search by title</span>
          <Icon name="search" className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
          <input value={props.title} onChange={(event) => props.onTitleChange(event.target.value)} placeholder="Search by title…" className="h-10 w-full rounded-xl bg-pale pr-3 pl-10 text-sm outline-none focus:ring-2 focus:ring-accent/30" />
        </label>
        <label>
          <span className="sr-only">Filter by type</span>
          <select className={selectClass} value={props.type} onChange={(event) => props.onTypeChange(event.target.value as TypeFilter)}>
            <option value="">Type: All</option>
            <option value="BOOK">Books</option>
            <option value="PDF">PDFs</option>
            <option value="PAPER">Papers</option>
            <option value="NOTE">Notes</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Filter by status</span>
          <select className={selectClass} value={props.status} onChange={(event) => props.onStatusChange(event.target.value as StatusFilter)}>
            <option value="">Status: All</option>
            <option value="TO_READ">To Read</option>
            <option value="READING">Reading</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Sort library</span>
          <select className={selectClass} value={props.sort} onChange={(event) => props.onSortChange(event.target.value as LibrarySort)}>
            <option value="title,asc">Title A–Z</option>
            <option value="title,desc">Title Z–A</option>
            <option value="author,asc">Author A–Z</option>
            <option value="author,desc">Author Z–A</option>
          </select>
        </label>
      </div>
      <Button variant="primary" onClick={props.onAdd} icon={<Icon name="add" />} className="shrink-0">Add Item</Button>
    </div>
  )
}
