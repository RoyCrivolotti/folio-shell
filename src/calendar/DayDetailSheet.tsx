import type { ReactNode } from 'react'
import { BottomSheet } from '../components/BottomSheet/BottomSheet'
import styles from './DayDetailSheet.module.css'
import type { DayDetailRow } from './dayDetailTypes'

function DayDetailRowItem({ row }: { row: DayDetailRow }) {
  const body = (
    <>
      <div className={styles.itemLabel}>{row.label}</div>
      {row.sublabel ? <div className={styles.itemSublabel}>{row.sublabel}</div> : null}
    </>
  )

  if (!row.onClick) {
    return (
      <li>
        <div className={`${styles.item} ${styles.itemStatic}`}>{body}</div>
      </li>
    )
  }

  return (
    <li>
      <button type="button" className={styles.item} onClick={row.onClick}>
        {body}
      </button>
    </li>
  )
}

export function DayDetailSheet({
  title,
  rows,
  emptyMessage = 'No events on this day.',
  onClose,
  footer,
}: {
  title: string
  rows: ReadonlyArray<DayDetailRow>
  emptyMessage?: string
  onClose: () => void
  footer?: ReactNode
}) {
  return (
    <BottomSheet title={title} onClose={onClose}>
      {rows.length === 0 ? <p className={styles.empty}>{emptyMessage}</p> : null}
      {rows.length > 0 ? (
        <ul className={styles.list}>
          {rows.map((row) => (
            <DayDetailRowItem key={row.id} row={row} />
          ))}
        </ul>
      ) : null}
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </BottomSheet>
  )
}
