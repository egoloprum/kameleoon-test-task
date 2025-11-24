import { Button } from '@/shared/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Toggle } from '@/shared/components/ui/toggle'
import { useAppContext } from '@/shared/lib/context'
import { ChevronDown, Square, SquareCheck } from 'lucide-react'
import { useState } from 'react'
import styles from './LineStyleSelector.module.css'

const LINE_STYLES = ['Line', 'Smooth', 'Area'] as const

export const LineStyleSelector = () => {
  const { selectedLineStyle, setSelectedLineStyle } = useAppContext()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleLineStyleSelect = (lineStyle: (typeof LINE_STYLES)[number]) => {
    setSelectedLineStyle(lineStyle)
    setIsPopoverOpen(false)
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild className={styles.popoverTrigger}>
        <Button variant="outline">
          Line style: {selectedLineStyle}
          <ChevronDown className={`${styles.chevron} ${isPopoverOpen ? styles.chevronOpen : ''}`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={styles.popoverContent}>
        {LINE_STYLES.map(lineStyle => (
          <Toggle
            key={lineStyle}
            pressed={selectedLineStyle === lineStyle}
            onPressedChange={() => handleLineStyleSelect(lineStyle)}
            aria-label={`Select ${lineStyle}`}
            className={styles.toggle}
          >
            {selectedLineStyle === lineStyle ? <SquareCheck /> : <Square />}
            {lineStyle}
          </Toggle>
        ))}
      </PopoverContent>
    </Popover>
  )
}
