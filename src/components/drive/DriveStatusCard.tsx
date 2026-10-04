import { Link } from 'react-router-dom'
import Icon from '../common/Icon'

interface DriveStatusCardProps {
  connected: boolean | null
  error?: boolean
}

export default function DriveStatusCard({ connected, error = false }: DriveStatusCardProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold"><Icon name="cloud_done" /> Google Drive</h2>
        <span className="flex items-center gap-1.5 rounded-full bg-pale px-2.5 py-1 text-xs">
          <span className={['h-2 w-2 rounded-full', connected ? 'bg-connected' : 'bg-line'].join(' ')} />
          {error ? 'Unavailable' : connected === null ? 'Checking…' : connected ? 'Connected' : 'Not connected'}
        </span>
      </div>
      <p className="mt-5 text-sm leading-6 text-muted">
        {error
          ? 'Google Drive status could not be loaded.'
          : connected === null
            ? 'Checking your Google Drive connection.'
            : connected
              ? 'PDF uploads are sent through your connected Google Drive.'
              : 'Connect Google Drive to upload PDFs through the backend.'}
      </p>
      <Link to="/google-drive" className="mt-5 inline-flex rounded-xl bg-pale px-4 py-2 text-sm font-medium hover:bg-pale-strong">
        {connected ? 'Manage' : 'View connection'}
      </Link>
    </section>
  )
}
