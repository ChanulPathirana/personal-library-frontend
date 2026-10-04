import { NavLink } from 'react-router-dom'
import brandMark from '../../assets/library-mark.svg'
import Icon from '../common/Icon'

interface SidebarProps {
  connected: boolean | null
  statusError: boolean
}

const links = [
  { to: '/', label: 'Overview', icon: 'dashboard' },
  { to: '/library', label: 'Library', icon: 'local_library' },
  { to: '/upload', label: 'Upload PDF', icon: 'upload_file' },
  { to: '/google-drive', label: 'Google Drive', icon: 'cloud_done' },
]

export default function Sidebar({ connected, statusError }: SidebarProps) {
  const statusText = statusError ? 'Status unavailable' : connected === null ? 'Checking connection…' : connected ? 'Connected' : 'Not connected'

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col justify-between bg-white p-3 shadow-[0_1px_8px_rgba(0,0,0,0.04)] lg:flex">
        <div>
          <div className="mb-6 flex items-center justify-between gap-2 px-1 pt-1">
            <div className="flex items-center gap-2">
              <img src={brandMark} alt="" className="h-8 w-8" />
              <div>
                <p className="text-sm font-semibold">Library</p>
                <p className="text-xs text-muted">Personal Library</p>
              </div>
            </div>
            <span className="rounded-full bg-badge-toread px-2 py-1 text-xs">Personal</span>
          </div>
          <nav aria-label="Main navigation" className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => [
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                  isActive ? 'bg-navy font-semibold text-white' : 'text-muted hover:bg-pale hover:text-ink',
                ].join(' ')}
              >
                <Icon name={link.icon} className="text-[19px]" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="rounded-xl bg-pale p-3 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <span className={['h-2 w-2 rounded-full', connected ? 'bg-connected' : 'bg-line'].join(' ')} />
            {statusText}
          </p>
          <p className="mt-1 text-xs text-muted">Google Drive</p>
        </div>
      </aside>
      <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line/50 bg-white px-2 py-2 lg:hidden">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => [
            'flex flex-col items-center gap-1 rounded-lg px-1 py-1 text-[11px]',
            isActive ? 'bg-navy text-white' : 'text-muted',
          ].join(' ')}>
            <Icon name={link.icon} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
