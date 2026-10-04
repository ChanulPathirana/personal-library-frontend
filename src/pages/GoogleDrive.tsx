import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { connectGoogleDrive, disconnectGoogleDrive } from '../api/googleDriveApi'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import Icon from '../components/common/Icon'
import LoadingState from '../components/common/LoadingState'
import PageHeader from '../components/common/PageHeader'
import DisconnectDialog from '../components/drive/DisconnectDialog'
import DriveDisconnectedPanel from '../components/drive/DriveDisconnectedPanel'
import type { DriveOutletContext } from '../components/layout/AppLayout'

export default function GoogleDrive() {
  const { driveStatus, driveLoading, driveError, refreshDriveStatus } = useOutletContext<DriveOutletContext>()
  const [disconnectOpen, setDisconnectOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  function connect() {
    try {
      connectGoogleDrive()
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : 'Could not start Google Drive connection.')
    }
  }

  async function disconnect() {
    await disconnectGoogleDrive()
    await refreshDriveStatus()
    setDisconnectOpen(false)
  }

  async function changeAccount() {
    setBusy(true)
    setActionError(null)
    try {
      await disconnectGoogleDrive()
      await refreshDriveStatus()
      connectGoogleDrive()
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : 'Could not change the Google Drive connection.')
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="Settings / Storage / Google Drive" title="Storage & Cloud Integration" subtitle="Manage the Google Drive connection used for PDF uploads." />
      {driveLoading ? <LoadingState label="Checking Google Drive connection…" /> : driveError ? (
        <EmptyState title="Could not check Google Drive" description={driveError} action={<Button onClick={() => { void refreshDriveStatus() }}>Retry</Button>} />
      ) : driveStatus?.connected ? (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pale"><Icon name="cloud_done" className="text-3xl text-accent" /></span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-2xl">Google Drive Integration</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pale px-3 py-1 text-xs"><span className="h-2 w-2 rounded-full bg-connected" /> Connected</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">New PDF uploads can be stored in your connected Google Drive through the Personal Library backend.</p>
            </div>
          </div>
          <div className="mt-7 rounded-xl bg-pale p-4 text-sm">
            <p className="font-medium">Connection active</p>
            <p className="mt-1 text-muted">The backend currently provides connection status only.</p>
          </div>
          {actionError && <p role="alert" className="mt-4 text-sm text-danger">{actionError}</p>}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button disabled={busy} onClick={() => { void changeAccount() }} icon={<Icon name="switch_account" />}>{busy ? 'Changing account…' : 'Change Account'}</Button>
            <Button variant="ghost" disabled={busy} onClick={() => setDisconnectOpen(true)} className="text-danger hover:text-danger" icon={<Icon name="link_off" />}>Disconnect</Button>
          </div>
          <p className="mt-6 rounded-xl bg-pale p-4 text-xs leading-5 text-muted">Changing accounts disconnects the current connection before starting a new Google authorization. Existing Google Drive files are not removed by disconnecting.</p>
        </section>
      ) : <DriveDisconnectedPanel onConnect={connect} />}
      {actionError && !driveStatus?.connected && <p role="alert" className="mt-4 rounded-xl bg-white p-3 text-sm text-danger">{actionError}</p>}
      {disconnectOpen && <DisconnectDialog onClose={() => setDisconnectOpen(false)} onConfirm={disconnect} />}
    </div>
  )
}
