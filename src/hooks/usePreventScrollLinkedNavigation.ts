import { useEffect } from 'react'
import {
  blockScrollLinkedNavigationWheel,
  wheelEventTargetsCalendar,
} from '../calendar/scrollNavGuard'

export type ScrollNavGuardScope = 'document' | 'calendar'

/** Block Chrome scroll-linked back/forward on horizontal trackpad swipes. */
export function usePreventScrollLinkedNavigation(scope: ScrollNavGuardScope = 'document') {
  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (scope === 'calendar' && !wheelEventTargetsCalendar(event)) return
      blockScrollLinkedNavigationWheel(event)
    }

    document.addEventListener('wheel', onWheel, { passive: false, capture: true })
    return () => document.removeEventListener('wheel', onWheel, { capture: true })
  }, [scope])
}
