import { apiRequest } from './client'
import type {
  ItemType,
  LibraryItem,
  LibraryItemInput,
  Page,
  ReadingStatus,
} from '../types/library'

const libraryPath = '/api/library'

export function getLibraryItems(page: number, size: number): Promise<Page<LibraryItem>> {
  const query = new URLSearchParams({ page: String(page), size: String(size) })
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
  const query = new URLSearchParams({ title })
  return apiRequest(`${libraryPath}/search?${query}`)
}

export function uploadPdf(file: File): Promise<LibraryItem> {
  const formData = new FormData()
  formData.append('file', file)
  return apiRequest(`${libraryPath}/upload`, {
    method: 'POST',
    body: formData,
  })
}
