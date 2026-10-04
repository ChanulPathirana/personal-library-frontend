import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import brandMark from '../../assets/library-mark.svg'
import Button from '../common/Button'
import Icon from '../common/Icon'

export default function Topbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 right-0 left-0 z-30 h-16 bg-white/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:left-60">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-5">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img src={brandMark} alt="" className="h-8 w-8 shrink-0" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">Personal Library</span>
            <span className="hidden truncate text-xs text-muted sm:block">Intellectual Assets &amp; Knowledge Vault</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <form className="relative hidden sm:block" role="search" onSubmit={(event) => {
            event.preventDefault()
            navigate('/library?title=' + encodeURIComponent(query.trim()))
          }}>
            <Icon name="search" className="absolute top-1/2 left-2 -translate-y-1/2 text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search library titles" placeholder="Search titles" className="h-9 w-40 rounded-xl bg-pale pr-3 pl-9 text-sm outline-none focus:ring-2 focus:ring-accent/30 xl:w-64" />
          </form>
          <Button onClick={() => navigate('/library?add=1')} aria-label="Add Item" className="px-2 sm:px-4" icon={<Icon name="add" />}><span className="hidden sm:inline">Add Item</span></Button>
          <Button onClick={() => navigate('/upload')} aria-label="Upload PDF" variant="primary" className="px-2 sm:px-4" icon={<Icon name="arrow_upward" />}><span className="hidden sm:inline">Upload PDF</span></Button>
        </div>
      </div>
    </header>
  )
}
