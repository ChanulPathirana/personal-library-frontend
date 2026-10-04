import { useEffect, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import {
  deleteLibraryItem,
  getItemsByStatus,
  getItemsByType,
  getLibraryItems,
  searchItemsByTitle,
  updateLibraryItem,
  uploadPdf,
} from '../api/libraryApi'
import type { LibrarySort } from '../api/libraryApi'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import LoadingState from '../components/common/LoadingState'
import Modal from '../components/common/Modal'
import PageHeader from '../components/common/PageHeader'
import LibraryFilters from '../components/library/LibraryFilters'
import type { StatusFilter, TypeFilter } from '../components/library/LibraryFilters'
import LibraryItemModal from '../components/library/LibraryItemModal'
import LibraryTable from '../components/library/LibraryTable'
import Pagination from '../components/library/Pagination'
import type { DriveOutletContext } from '../components/layout/AppLayout'
import type { CreateLibraryItemWithFileInput, LibraryItem, LibraryItemInput } from '../types/library'

const pageSize = 7

interface LibraryResult {
  items: LibraryItem[]
  totalElements: number
  totalPages: number
}

export default function Library() {
  const { driveStatus, driveLoading, driveError } = useOutletContext<DriveOutletContext>()
  const [searchParams, setSearchParams] = useSearchParams()
  const titleInput = searchParams.get('title') ?? ''
  const addOpen = searchParams.get('add') === '1'
  const [title, setTitle] = useState(titleInput.trim())
  const [type, setType] = useState<TypeFilter>('')
  const [status, setStatus] = useState<StatusFilter>('')
  const [sort, setSort] = useState<LibrarySort>('title,asc')
  const [page, setPage] = useState(0)
  const [result, setResult] = useState<LibraryResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<LibraryItem | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  function beginReload() {
    setLoading(true)
    setError(null)
  }

  useEffect(() => {
    if (titleInput.trim() === title) return
    const timer = window.setTimeout(() => {
      setLoading(true)
      setError(null)
      setTitle(titleInput.trim())
      setPage(0)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [titleInput, title])

  useEffect(() => {
    let active = true
    async function load() {
      try {
        let next: LibraryResult
        if (!title && !type && !status) {
          const response = await getLibraryItems(page, pageSize, sort)
          next = {
            items: response.content,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
          }
        } else {
          const matches = title
            ? await searchItemsByTitle(title)
            : status
              ? await getItemsByStatus(status)
              : await getItemsByType(type as Exclude<TypeFilter, ''>)
          const filtered = matches.filter((item) =>
            (!title || item.title.toLocaleLowerCase().includes(title.toLocaleLowerCase())) &&
            (!type || item.type === type) &&
            (!status || item.status === status),
          )
          const [field, direction] = sort.split(',') as ['title' | 'author', 'asc' | 'desc']
          filtered.sort((a, b) => direction === 'asc'
            ? a[field].localeCompare(b[field])
            : b[field].localeCompare(a[field]))
          next = {
            items: filtered.slice(page * pageSize, (page + 1) * pageSize),
            totalElements: filtered.length,
            totalPages: Math.ceil(filtered.length / pageSize),
          }
        }
        if (active) setResult(next)
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : 'Could not load library items.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [title, type, status, sort, page, refreshKey])

  function updateTitle(value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('title', value)
    else next.delete('title')
    setSearchParams(next, { replace: true })
  }

  function openAdd() {
    setEditingItem(null)
    setSuccessMessage(null)
    const next = new URLSearchParams(searchParams)
    next.set('add', '1')
    setSearchParams(next)
  }

  function closeItemModal() {
    setEditingItem(null)
    const next = new URLSearchParams(searchParams)
    next.delete('add')
    setSearchParams(next, { replace: true })
  }

  function finishSave(message: string) {
    closeItemModal()
    setSuccessMessage(message)
    beginReload()
    setPage(0)
    setRefreshKey((value) => value + 1)
  }

  async function createItem(data: CreateLibraryItemWithFileInput) {
    await uploadPdf(data)
    finishSave('Item added and PDF uploaded to Google Drive.')
  }

  async function updateItem(data: LibraryItemInput) {
    if (!editingItem) throw new Error('No item is selected for editing.')
    await updateLibraryItem(editingItem.id, data)
    finishSave('Item details updated.')
  }

  async function confirmDelete() {
    if (!deletingItem) return
    setDeleteBusy(true)
    setDeleteError(null)
    try {
      await deleteLibraryItem(deletingItem.id)
      setDeletingItem(null)
      beginReload()
      setPage(0)
      setRefreshKey((value) => value + 1)
    } catch (reason) {
      setDeleteError(reason instanceof Error ? reason.message : 'Could not delete this item.')
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Vault Index" title="My Library" subtitle="Browse and organize your books, PDFs, papers, and notes." />
      {successMessage && <p role="status" className="mb-4 rounded-xl bg-badge-completed/40 px-4 py-3 text-sm">{successMessage}</p>}
      <LibraryFilters
        title={titleInput}
        type={type}
        status={status}
        sort={sort}
        onTitleChange={updateTitle}
        onTypeChange={(value) => { beginReload(); setType(value); setPage(0) }}
        onStatusChange={(value) => { beginReload(); setStatus(value); setPage(0) }}
        onSortChange={(value) => { beginReload(); setSort(value); setPage(0) }}
        onAdd={openAdd}
      />
      {(title || type || status) && <p className="mb-3 text-xs text-muted">Filters and pagination apply to the returned matches.</p>}
      {loading ? <LoadingState label="Loading library items…" /> : error ? (
        <EmptyState title="Could not load the library" description={error} action={<Button onClick={() => { beginReload(); setRefreshKey((value) => value + 1) }}>Retry</Button>} />
      ) : !result || result.totalElements === 0 ? (
        <EmptyState title="No library items found" description="Try another title or filter, or add an item to your library." action={<Button variant="primary" onClick={openAdd}>Add Item</Button>} />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <LibraryTable items={result.items} onEdit={(item) => { setSuccessMessage(null); setEditingItem(item) }} onDelete={(item) => { setDeleteError(null); setDeletingItem(item) }} />
          <Pagination page={page} totalPages={result.totalPages} totalElements={result.totalElements} pageSize={pageSize} onChange={(value) => { beginReload(); setPage(value) }} />
        </div>
      )}
      {(addOpen || editingItem) && (
        <LibraryItemModal
          key={editingItem?.id ?? 'new'}
          item={editingItem ?? undefined}
          onClose={closeItemModal}
          onCreate={createItem}
          onUpdate={updateItem}
          driveConnected={driveStatus?.connected ?? null}
          driveLoading={driveLoading}
          driveError={driveError}
        />
      )}
      {deletingItem && (
        <Modal title="Delete library item?" subtitle={deletingItem.title} onClose={() => setDeletingItem(null)}>
          <p className="text-sm leading-6 text-muted">This removes the library item’s database metadata only. It does not delete the Google Drive file.</p>
          {deleteError && <p role="alert" className="mt-3 text-sm text-danger">{deleteError}</p>}
          <div className="mt-6 flex justify-end gap-2">
            <Button onClick={() => setDeletingItem(null)} disabled={deleteBusy}>Cancel</Button>
            <Button variant="danger" onClick={() => { void confirmDelete() }} disabled={deleteBusy}>{deleteBusy ? 'Deleting…' : 'Delete Item'}</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
