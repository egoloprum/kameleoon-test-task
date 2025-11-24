import styles from './IntervalSelector.module.css'

import { Button } from '@/shared/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Toggle } from '@/shared/components/ui/toggle'
import { useAppContext } from '@/shared/lib/context'
import { Square, SquareCheck } from 'lucide-react'
import { useState } from 'react'

export const IntervalSelector = () => {
  const { selectedInterval, setSelectedInterval } = useAppContext()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleIntervalSelect = (interval: 'Day' | 'Week') => {
    setSelectedInterval(interval)
    setIsPopoverOpen(false)
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild className={styles.popoverTrigger}>
        <Button variant="outline">{selectedInterval}</Button>
      </PopoverTrigger>
      <PopoverContent className={styles.popoverContent}>
        <Toggle
          pressed={selectedInterval === 'Day'}
          onPressedChange={() => handleIntervalSelect('Day')}
          aria-label="Interval day"
          className={styles.toggle}
        >
          {selectedInterval === 'Day' ? <SquareCheck /> : <Square />}
          Day
        </Toggle>
        <Toggle
          pressed={selectedInterval === 'Week'}
          onPressedChange={() => handleIntervalSelect('Week')}
          aria-label="Interval week"
          className={styles.toggle}
        >
          {selectedInterval === 'Week' ? <SquareCheck /> : <Square />}
          Week
        </Toggle>
      </PopoverContent>
    </Popover>
  )
}
