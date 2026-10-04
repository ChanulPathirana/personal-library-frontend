import type { DragEvent } from 'react'
import Icon from '../common/Icon'

interface UploadDropzoneProps {
  file: File | null
  onFileChange: (file: File | null) => void
  disabled?: boolean
}

export default function UploadDropzone({ file, onFileChange, disabled = false }: UploadDropzoneProps) {
  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault()
    if (!disabled) onFileChange(event.dataTransfer.files[0] ?? null)
  }

  return (
    <>
      <div onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} className="relative rounded-2xl bg-pale p-8 text-center shadow-sm transition-colors hover:bg-pale-strong/60">
        <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white"><Icon name="cloud_upload" className="text-3xl" /></span>
        <p className="text-base font-semibold">Drop your PDF here</p>
        <p className="mt-1 text-sm text-muted">or <label htmlFor="pdf-file" className="cursor-pointer font-medium text-accent hover:underline">browse from your computer</label></p>
        <p className="mx-auto mt-3 w-fit rounded-full bg-white px-3 py-1 text-xs text-muted">PDF files only</p>
      </div>
      <input id="pdf-file" type="file" accept="application/pdf" disabled={disabled} onChange={(event) => {
        const next = event.currentTarget.files?.[0] ?? null
        event.currentTarget.value = ''
        onFileChange(next)
      }} className="sr-only" />
      {file && (
        <div className="mt-5 flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-pale text-danger"><Icon name="picture_as_pdf" /></span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{file.name}</p>
            <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(1)} MB · Ready</p>
          </div>
          <button type="button" onClick={() => onFileChange(null)} disabled={disabled} aria-label="Remove selected file" className="rounded-lg p-2 text-muted hover:bg-pale hover:text-danger"><Icon name="close" /></button>
        </div>
      )}
    </>
  )
}
