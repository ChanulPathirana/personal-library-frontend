import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ItemType, LibraryItem, LibraryItemInput, ReadingStatus } from '../../types/library'
import Button from '../common/Button'
import Modal from '../common/Modal'

interface LibraryItemModalProps {
  item?: LibraryItem
  onClose: () => void
  onSave: (data: LibraryItemInput) => Promise<void>
}

const types: { value: ItemType; label: string }[] = [
  { value: 'BOOK', label: 'Book' },
  { value: 'PDF', label: 'PDF' },
  { value: 'PAPER', label: 'Paper' },
  { value: 'NOTE', label: 'Note' },
]
const statuses: { value: ReadingStatus; label: string }[] = [
  { value: 'TO_READ', label: 'To Read' },
  { value: 'READING', label: 'Reading' },
  { value: 'COMPLETED', label: 'Completed' },
]

export default function LibraryItemModal({ item, onClose, onSave }: LibraryItemModalProps) {
  const [form, setForm] = useState<LibraryItemInput>({
    title: item?.title ?? '',
    author: item?.author ?? '',
    type: item?.type ?? 'BOOK',
    status: item?.status ?? 'TO_READ',
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = form.title.trim()
    const author = form.author.trim()
    if (!title || !author) {
      setError('Title and author are required.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      await onSave({ ...form, title, author })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save the item.')
      setBusy(false)
    }
  }

  return (
    <Modal title={item ? 'Edit Library Item' : 'Add Library Item'} subtitle={item ? 'Update this item in your library.' : 'Register a new intellectual asset to your library.'} onClose={onClose}>
      <form onSubmit={(event) => { void submit(event) }} className="space-y-4">
        <label className="block text-xs font-medium">
          Item Title
          <input required autoFocus value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Gödel, Escher, Bach" className="mt-1.5 h-10 w-full rounded-xl bg-pale px-3 text-sm outline-none focus:ring-2 focus:ring-accent/30" />
        </label>
        <label className="block text-xs font-medium">
          Author / Contributor
          <input required value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} placeholder="e.g. Douglas Hofstadter" className="mt-1.5 h-10 w-full rounded-xl bg-pale px-3 text-sm outline-none focus:ring-2 focus:ring-accent/30" />
        </label>
        <fieldset>
          <legend className="mb-1.5 text-xs font-medium">Type Classification</legend>
          <div className="grid grid-cols-4 gap-2">
            {types.map((type) => (
              <label key={type.value} className="cursor-pointer">
                <input type="radio" name="itemType" value={type.value} checked={form.type === type.value} onChange={() => setForm({ ...form, type: type.value })} className="peer sr-only" />
                <span className="block rounded-xl bg-pale px-1 py-2 text-center text-xs peer-checked:bg-black peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-accent">{type.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-1.5 text-xs font-medium">Reading Status</legend>
          <div className="grid grid-cols-3 gap-2">
            {statuses.map((status) => (
              <label key={status.value} className="cursor-pointer">
                <input type="radio" name="itemStatus" value={status.value} checked={form.status === status.value} onChange={() => setForm({ ...form, status: status.value })} className="peer sr-only" />
                <span className="block rounded-xl bg-pale px-1 py-2 text-center text-xs peer-checked:bg-badge-reading peer-focus-visible:outline-2 peer-focus-visible:outline-accent">{status.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onClose} disabled={busy}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={busy}>{busy ? 'Saving…' : item ? 'Save Changes' : 'Add Item'}</Button>
        </div>
      </form>
    </Modal>
  )
}
