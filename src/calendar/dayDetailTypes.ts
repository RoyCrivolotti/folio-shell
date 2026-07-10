import type { ReactNode } from 'react'

export type DayDetailRow = {
  id: string
  label: string
  sublabel?: string
  onClick?: () => void
}

export type DayDetailSheetProps = {
  title: string
  rows: ReadonlyArray<DayDetailRow>
  emptyMessage?: string
  onClose: () => void
  footer?: ReactNode
}
