import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { getItemsByStatus, getLibraryItems } from '../api/libraryApi'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import Icon from '../components/common/Icon'
import LoadingState from '../components/common/LoadingState'
import PageHeader from '../components/common/PageHeader'
import SummaryCard from '../components/common/SummaryCard'
import DriveStatusCard from '../components/drive/DriveStatusCard'
import StatusBadge from '../components/library/StatusBadge'
import TypeBadge from '../components/library/TypeBadge'
import type { DriveOutletContext } from '../components/layout/AppLayout'
import type { LibraryItem } from '../types/library'

interface DashboardData {
  total: number
  toRead: number
  reading: number
  completed: number
  items: LibraryItem[]
}

export default function Dashboard() {
  const { driveStatus, driveError } = useOutletContext<DriveOutletContext>()
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true
    Promise.all([
      getLibraryItems(0, 5),
      getItemsByStatus('TO_READ'),
      getItemsByStatus('READING'),
      getItemsByStatus('COMPLETED'),
    ]).then(([page, toRead, reading, completed]) => {
      if (active) {
        setData({
          total: page.totalElements,
          items: page.content,
          toRead: toRead.length,
          reading: reading.length,
          completed: completed.length,
        })
        setError(null)
      }
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : 'Could not load your library.')
    })
    return () => { active = false }
  }, [refreshKey])

  return (
    <div>
      <PageHeader title="Overview" subtitle="Your reading library at a glance" />
      {error ? (
        <EmptyState title="Could not load the dashboard" description={error} action={<Button onClick={() => { setError(null); setRefreshKey((value) => value + 1) }}>Retry</Button>} />
      ) : !data ? <LoadingState label="Loading your overview…" /> : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Total Items" value={data.total} icon="library_books" note="In your library" />
            <SummaryCard label="To Read" value={data.toRead} icon="schedule" note="Backlog" />
            <SummaryCard label="Reading" value={data.reading} icon="menu_book" note="Active now" />
            <SummaryCard label="Completed" value={data.completed} icon="check_circle" note="Finished" />
          </div>
          <div className="mt-5 grid items-start gap-5 xl:grid-cols-12">
            <section className="overflow-hidden rounded-2xl bg-white shadow-sm xl:col-span-8">
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <h2 className="font-display text-2xl">Library Items</h2>
                <Link to="/library" className="text-sm font-medium text-accent hover:underline">View all →</Link>
              </div>
              {data.items.length === 0 ? (
                <div className="border-t border-pale px-5 py-8 text-center text-sm text-muted">Your library is empty. Add an item to get started.</div>
              ) : data.items.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center gap-3 border-t border-pale px-5 py-4 sm:flex-nowrap">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pale"><Icon name={item.type === 'BOOK' ? 'menu_book' : item.type === 'PAPER' ? 'article' : item.type === 'NOTE' ? 'edit_note' : 'picture_as_pdf'} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.title}</p>
                    <p className="truncate text-sm text-muted">{item.author}</p>
                  </div>
                  <TypeBadge type={item.type} />
                  <StatusBadge status={item.status} />
                  {item.googleDriveUrl?.startsWith('https://') && <a href={item.googleDriveUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-accent hover:underline">Drive ↗</a>}
                </div>
              ))}
            </section>
            <div className="space-y-5 xl:col-span-4">
              <DriveStatusCard connected={driveStatus?.connected ?? null} error={Boolean(driveError)} />
              <section className="rounded-2xl bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-base font-semibold">Quick Add</h2>
                <div className="space-y-2">
                  <Link to="/library?add=1" className="flex items-center gap-3 rounded-xl bg-pale p-3 hover:bg-pale-strong">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white"><Icon name="bookmark_add" /></span>
                    <span><strong className="block text-sm">Add Library Item</strong><span className="text-xs text-muted">Add any content type with a PDF</span></span>
                  </Link>
                  <Link to="/upload" className="flex items-center gap-3 rounded-xl bg-pale p-3 hover:bg-pale-strong">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white"><Icon name="cloud_upload" /></span>
                    <span><strong className="block text-sm">Upload PDF</strong><span className="text-xs text-muted">Send a PDF to Google Drive</span></span>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
