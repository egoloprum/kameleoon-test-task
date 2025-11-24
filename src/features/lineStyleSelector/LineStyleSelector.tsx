import { Button } from '@/shared/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Toggle } from '@/shared/components/ui/toggle'
import { useAppContext } from '@/shared/lib/context'
import { Square, SquareCheck } from 'lucide-react'
import { useState } from 'react'

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
      <PopoverTrigger asChild className="w-40">
        <Button variant="outline">Line style: {selectedLineStyle}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit flex flex-col">
        {LINE_STYLES.map(lineStyle => (
          <Toggle
            key={lineStyle}
            pressed={selectedLineStyle === lineStyle}
            onPressedChange={() => handleLineStyleSelect(lineStyle)}
            aria-label={`Select ${lineStyle}`}
            className="data-[state=on]:bg-transparent data-[state=on]:text-foreground justify-start gap-2"
          >
            {selectedLineStyle === lineStyle ? <SquareCheck /> : <Square />}
            {lineStyle}
          </Toggle>
        ))}
      </PopoverContent>
    </Popover>
  )
}
