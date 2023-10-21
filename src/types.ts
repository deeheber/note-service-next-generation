export type Note = {
  id: string
  content: string
  author: string
  createdAt: string
  updatedAt?: string
}

export type ListNotesResult = {
  items: Note[]
  total: string
}
