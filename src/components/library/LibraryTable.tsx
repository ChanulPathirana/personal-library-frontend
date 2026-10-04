import type { LibraryItem, ItemType } from '../../types/library'
import Icon from '../common/Icon'
import StatusBadge from './StatusBadge'
import TypeBadge from './TypeBadge'

interface LibraryTableProps {
  items: LibraryItem[]
  onEdit: (item: LibraryItem) => void
  onDelete: (item: LibraryItem) => void
}

const itemIcons: Record<ItemType, string> = {
  BOOK: 'menu_book',
  PDF: 'picture_as_pdf',
  PAPER: 'article',
  NOTE: 'edit_note',
}

const iconColors: Record<ItemType, string> = {
  BOOK: 'bg-badge-reading text-accent',
  PDF: 'bg-red-50 text-danger',
  PAPER: 'bg-pale-strong text-ink',
  NOTE: 'bg-badge-toread text-ink',
}

export default function LibraryTable({ items, onEdit, onDelete }: LibraryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse text-left text-sm">
        <thead className="bg-pale/60 text-xs uppercase tracking-wide text-muted">
          <tr>
            <th scope="col" className="px-5 py-3 font-medium">Title &amp; Artifact</th>
            <th scope="col" className="px-4 py-3 font-medium">Author / Source</th>
            <th scope="col" className="px-4 py-3 font-medium">Type</th>
            <th scope="col" className="px-4 py-3 font-medium">Status</th>
            <th scope="col" className="px-4 py-3 font-medium">Google Drive</th>
            <th scope="col" className="px-5 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-pale hover:bg-pale/40">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className={'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ' + iconColors[item.type]}><Icon name={itemIcons[item.type]} /></span>
                  <span className="font-semibold">{item.title}</span>
                </div>
              </td>
              <td className="px-4 py-4">{item.author}</td>
              <td className="px-4 py-4"><TypeBadge type={item.type} /></td>
              <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
              <td className="px-4 py-4">
                {item.googleDriveUrl?.startsWith('https://') ? (
                  <a className="font-medium text-accent hover:underline" href={item.googleDriveUrl} target="_blank" rel="noopener noreferrer">Open ↗</a>
                ) : <span className="text-muted">—</span>}
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-end gap-1">
                  <button type="button" onClick={() => onEdit(item)} aria-label={'Edit ' + item.title} className="rounded-lg p-2 text-muted hover:bg-pale hover:text-ink"><Icon name="edit" className="text-[18px]" /></button>
                  <button type="button" onClick={() => onDelete(item)} aria-label={'Delete ' + item.title} className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-danger"><Icon name="delete" className="text-[18px]" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
