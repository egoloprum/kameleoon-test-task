import { Button } from '@/shared/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Toggle } from '@/shared/components/ui/toggle'
import { Square, SquareCheck } from 'lucide-react'
import { useState } from 'react'

type LineStyle = 'Style 1' | 'Style 2' | 'Style 3' | 'Style 4'
const LINE_STYLES: LineStyle[] = ['Style 1', 'Style 2', 'Style 3', 'Style 4']

export const LineStyleSelector = ({}) => {
  const [selectedLineStyle, setSelectedLineStyle] = useState<LineStyle>('Style 1')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleLineStyleSelect = (lineStyle: LineStyle) => {
    setSelectedLineStyle(lineStyle)
    setIsPopoverOpen(false)
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild className="w-20">
        <Button variant="outline">{selectedLineStyle}</Button>
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
