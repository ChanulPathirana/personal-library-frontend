import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { uploadPdf } from '../api/libraryApi'
import Button from '../components/common/Button'
import Icon from '../components/common/Icon'
import PageHeader from '../components/common/PageHeader'
import UploadDropzone from '../components/library/UploadDropzone'
import type { DriveOutletContext } from '../components/layout/AppLayout'
import type { LibraryItem, ReadingStatus } from '../types/library'

const fieldClass = 'mt-1.5 h-10 w-full rounded-xl bg-pale px-3 text-sm outline-none focus:ring-2 focus:ring-accent/30'

export default function UploadPdf() {
  const { driveStatus, driveLoading, driveError } = useOutletContext<DriveOutletContext>()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [status, setStatus] = useState<ReadingStatus>('TO_READ')
  const [fileError, setFileError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [uploaded, setUploaded] = useState<LibraryItem | null>(null)

  function selectFile(next: File | null) {
    setUploaded(null)
    setFileError(null)
    if (next && next.type !== 'application/pdf' && !next.name.toLowerCase().endsWith('.pdf')) {
      setFile(null)
      setFileError('Choose a PDF file.')
      return
    }
    setFile(next)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!file) {
      setFileError('Choose a PDF file before uploading.')
      return
    }
    if (!title.trim() || !author.trim()) {
      setError('Title and author are required.')
      return
    }
    if (!driveStatus?.connected) {
      setError('Connect Google Drive before uploading a PDF.')
      return
    }
    setBusy(true)
    setError(null)
    setUploaded(null)
    try {
      const item = await uploadPdf({
        title: title.trim(),
        author: author.trim(),
        type: 'PDF',
        status,
        file,
      })
      setUploaded(item)
      setFile(null)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not upload the PDF.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-[740px]">
      <PageHeader eyebrow="Storage Engine / Ingestion Pipeline" title="Upload Document" subtitle="Store a PDF in Google Drive and add it to your personal library." />
      <UploadDropzone file={file} onFileChange={selectFile} disabled={busy} />
      {fileError && <p role="alert" className="mt-2 text-sm text-danger">{fileError}</p>}
      <form onSubmit={(event) => { void submit(event) }} className="mt-7 rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-base font-semibold"><Icon name="auto_stories" className="text-accent" /> Bibliographic Details</h2>
          <span className="text-xs text-muted">Enter the details below</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-medium sm:col-span-2">
            Title
            <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Document title" className={fieldClass} />
          </label>
          <label className="block text-xs font-medium">
            Author(s)
            <input required value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Author or contributor" className={fieldClass} />
          </label>
          <label className="block text-xs font-medium">
            Reading Status
            <select value={status} onChange={(event) => setStatus(event.target.value as ReadingStatus)} className={fieldClass}>
              <option value="TO_READ">To Read</option>
              <option value="READING">Reading</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </label>
          <div className="sm:col-span-2">
            <p className="text-xs font-medium">Format Type</p>
            <div className="mt-1.5 flex h-10 items-center gap-2 rounded-xl bg-pale px-3 text-sm"><span className="rounded-full bg-badge-toread px-2 py-0.5 text-xs">PDF</span> Portable Document <Icon name="lock" className="ml-auto text-base text-muted" /></div>
          </div>
        </div>
        <div className="mt-5 rounded-xl bg-pale p-3 text-sm">
          <div className="flex items-center gap-2">
            <span className={['h-2 w-2 rounded-full', driveStatus?.connected ? 'bg-connected' : 'bg-line'].join(' ')} />
            {driveLoading ? 'Checking Google Drive connection…' : driveError ? 'Google Drive status unavailable' : driveStatus?.connected ? 'Google Drive connected' : 'Google Drive not connected'}
          </div>
          {!driveLoading && !driveStatus?.connected && <Link to="/google-drive" className="mt-2 inline-block text-xs font-medium text-accent hover:underline">Manage connection →</Link>}
        </div>
        {busy && (
          <div role="status" className="mt-5 rounded-xl bg-pale p-3 text-sm">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-pale-strong border-t-accent align-[-2px]" aria-hidden="true" /> <span className="ml-2">Uploading PDF…</span>
          </div>
        )}
        {error && <p role="alert" className="mt-4 text-sm text-danger">{error}</p>}
        {uploaded && <div role="status" className="mt-4 rounded-xl bg-badge-completed/40 p-3 text-sm">Upload complete. <Link to="/library" className="font-medium text-accent hover:underline">View your library →</Link></div>}
        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="primary" disabled={busy || driveLoading || !driveStatus?.connected} icon={<Icon name="arrow_upward" />}>{busy ? 'Uploading…' : 'Upload PDF'}</Button>
        </div>
      </form>
    </div>
  )
}
