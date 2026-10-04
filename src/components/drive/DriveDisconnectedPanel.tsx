import Button from '../common/Button'
import Icon from '../common/Icon'

interface DriveDisconnectedPanelProps {
  onConnect: () => void
}

export default function DriveDisconnectedPanel({ onConnect }: DriveDisconnectedPanelProps) {
  return (
    <section className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pale"><Icon name="cloud_off" className="text-3xl" /></span>
      <h2 className="mt-5 font-display text-3xl">Google Drive is not connected</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted">Connect your Google account to store new PDF uploads in Google Drive through Personal Library.</p>
      <Button variant="primary" className="mt-6" onClick={onConnect} icon={<Icon name="cloud" />}>Connect Google Drive</Button>
    </section>
  )
}
