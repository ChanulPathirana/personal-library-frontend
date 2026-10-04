import { apiRequest } from './client'
import type {
  CreateLibraryItemWithFileInput,
  ItemType,
  LibraryItem,
  LibraryItemInput,
  Page,
  ReadingStatus,
} from '../types/library'

const libraryPath = '/api/library'

export type LibrarySort = 'title,asc' | 'title,desc' | 'author,asc' | 'author,desc'

export function getLibraryItems(
  page: number,
  size: number,
  sort: LibrarySort = 'title,asc',
): Promise<Page<LibraryItem>> {
  const query = new URLSearchParams({ page: String(page), size: String(size) })
  query.set('sort', sort)
  return apiRequest(`${libraryPath}?${query}`)
}

export function getLibraryItem(id: number): Promise<LibraryItem> {
  return apiRequest(`${libraryPath}/${id}`)
}

export function createLibraryItem(data: LibraryItemInput): Promise<LibraryItem> {
  return apiRequest(libraryPath, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function updateLibraryItem(id: number, data: LibraryItemInput): Promise<LibraryItem> {
  return apiRequest(`${libraryPath}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function deleteLibraryItem(id: number): Promise<void> {
  return apiRequest(`${libraryPath}/${id}`, { method: 'DELETE' })
}

export function getItemsByStatus(status: ReadingStatus): Promise<LibraryItem[]> {
  return apiRequest(`${libraryPath}/status/${encodeURIComponent(status)}`)
}

export function getItemsByType(type: ItemType): Promise<LibraryItem[]> {
  return apiRequest(`${libraryPath}/type/${encodeURIComponent(type)}`)
}

export function searchItemsByTitle(title: string): Promise<LibraryItem[]> {
  return apiRequest(`${libraryPath}/title/${encodeURIComponent(title)}`)
}

export function uploadPdf(data: CreateLibraryItemWithFileInput): Promise<LibraryItem> {
  const formData = new FormData()
  formData.append('title', data.title)
  formData.append('author', data.author)
  formData.append('type', data.type)
  formData.append('status', data.status)
  formData.append('file', data.file)
  return apiRequest(`${libraryPath}/upload`, {
    method: 'POST',
    body: formData,
  })
}
