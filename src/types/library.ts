export type ItemType = 'BOOK' | 'PDF' | 'PAPER' | 'NOTE'

export type ReadingStatus = 'TO_READ' | 'READING' | 'COMPLETED'

export interface LibraryItem {
  id: number
  title: string
  author: string
  type: ItemType
  status: ReadingStatus
  googleDriveFileId?: string | null
  googleDriveUrl?: string | null
}

export type LibraryItemInput = Pick<
  LibraryItem,
  'title' | 'author' | 'type' | 'status'
>

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}
