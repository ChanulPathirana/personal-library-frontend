import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { CreateLibraryItemWithFileInput, ItemType, LibraryItem, LibraryItemInput, ReadingStatus } from '../../types/library'
import { isPdfFile } from '../../utils/pdf'
import Button from '../common/Button'
import Icon from '../common/Icon'
import Modal from '../common/Modal'

interface LibraryItemModalProps {
  item?: LibraryItem
  onClose: () => void
  onCreate: (data: CreateLibraryItemWithFileInput) => Promise<void>
  onUpdate: (data: LibraryItemInput) => Promise<void>
  driveConnected: boolean | null
  driveLoading: boolean
  driveError: string | null
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

export default function LibraryItemModal({
  item,
  onClose,
  onCreate,
  onUpdate,
  driveConnected,
  driveLoading,
  driveError,
}: LibraryItemModalProps) {
  const [form, setForm] = useState<LibraryItemInput>({
    title: item?.title ?? '',
    author: item?.author ?? '',
    type: item?.type ?? 'BOOK',
    status: item?.status ?? 'TO_READ',
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const submittingRef = useRef(false)

  function selectFile(next: File | null) {
    if (!next) return
    if (!isPdfFile(next)) {
      setFile(null)
      setFileError('Choose a PDF file.')
      return
    }
    setFile(next)
    setFileError(null)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current) return
    const title = form.title.trim()
    const author = form.author.trim()
    if (!title || !author) {
      setError('Title and author are required.')
      return
    }
    if (!form.type || !form.status) {
      setError('Choose a content type and reading status.')
      return
    }
    if (!item && !file) {
      setFileError('A PDF file is required for every new library item.')
      return
    }
    if (!item && file && !isPdfFile(file)) {
      setFileError('Choose a PDF file.')
      return
    }
    if (!item && driveConnected !== true) {
      setError('Connect Google Drive before adding an item.')
      return
    }
    submittingRef.current = true
    setBusy(true)
    setError(null)
    try {
      const data = { ...form, title, author }
      if (item) await onUpdate(data)
      else {
        if (!file) throw new Error('A PDF file is required.')
        await onCreate({ ...data, file })
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not upload and save the item.')
      setBusy(false)
    } finally {
      submittingRef.current = false
    }
  }

  return (
    <Modal title={item ? 'Edit Library Item' : 'Add Library Item'} subtitle={item ? 'Update this item’s metadata.' : 'Add an item and its PDF to your library.'} onClose={() => { if (!busy) onClose() }}>
      <form onSubmit={(event) => { void submit(event) }} className="space-y-4">
        <label className="block text-xs font-medium">
          Item Title
          <input required autoFocus value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Gödel, Escher, Bach" className="mt-1.5 h-10 w-full rounded-xl bg-pale px-3 text-sm outline-none focus:ring-2 focus:ring-accent/30" />
        </label>
        <label className="block text-xs font-medium">
          Author / Source
          <input required value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} placeholder="e.g. Douglas Hofstadter" className="mt-1.5 h-10 w-full rounded-xl bg-pale px-3 text-sm outline-none focus:ring-2 focus:ring-accent/30" />
        </label>
        <fieldset>
          <legend className="mb-1.5 text-xs font-medium">Content Type</legend>
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
        {!item && (
          <div>
            <p className="mb-1.5 text-xs font-medium">PDF File</p>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-pale px-3 py-3 text-sm focus-within:ring-2 focus-within:ring-accent/30">
              <input type="file" accept="application/pdf" aria-label="Choose PDF file" aria-required="true" onChange={(event) => {
                const next = event.currentTarget.files?.[0] ?? null
                event.currentTarget.value = ''
                selectFile(next)
              }} className="sr-only" disabled={busy} />
              <Icon name="picture_as_pdf" className="text-danger" />
              <span className="min-w-0 flex-1 truncate">{file?.name ?? 'Choose a PDF file'}</span>
              <span className="font-medium text-accent">{file ? 'Replace' : 'Browse'}</span>
            </label>
            <p className="mt-1.5 text-xs text-muted">A PDF is required for every content type.</p>
            {fileError && <p role="alert" className="mt-1.5 text-sm text-danger">{fileError}</p>}
            <div className="mt-3 rounded-xl bg-pale px-3 py-2 text-xs">
              {driveLoading ? 'Checking Google Drive connection…' : driveError ? 'Google Drive status is unavailable.' : driveConnected ? 'Google Drive connected' : 'Google Drive must be connected before upload.'}
              {!driveLoading && driveConnected !== true && <Link to="/google-drive" className="ml-2 font-medium text-accent hover:underline">Manage connection →</Link>}
            </div>
          </div>
        )}
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onClose} disabled={busy}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={busy || (!item && (driveLoading || driveConnected !== true))}>{busy ? item ? 'Saving…' : 'Uploading…' : item ? 'Save Changes' : 'Add Item'}</Button>
        </div>
      </form>
    </Modal>
  )
}
