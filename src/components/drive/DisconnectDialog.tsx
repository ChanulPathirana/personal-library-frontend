import { useState } from 'react'
import Button from '../common/Button'
import Modal from '../common/Modal'

interface DisconnectDialogProps {
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function DisconnectDialog({ onClose, onConfirm }: DisconnectDialogProps) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function confirm() {
    setBusy(true)
    setError(null)
    try {
      await onConfirm()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not disconnect Google Drive.')
      setBusy(false)
    }
  }

  return (
    <Modal title="Disconnect Google Drive?" subtitle="Your existing files in Google Drive will not be deleted." onClose={onClose}>
      <p className="text-sm leading-6 text-muted">New PDF uploads will require a Google Drive connection.</p>
      {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
      <div className="mt-6 flex justify-end gap-2">
        <Button onClick={onClose} disabled={busy}>Cancel</Button>
        <Button variant="danger" onClick={() => { void confirm() }} disabled={busy}>{busy ? 'Disconnecting…' : 'Disconnect'}</Button>
      </div>
    </Modal>
  )
}
