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
      <PopoverTrigger asChild className="w-20">
        <Button variant="outline">{selectedInterval}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit flex flex-col">
        <Toggle
          pressed={selectedInterval === 'Day'}
          onPressedChange={() => handleIntervalSelect('Day')}
          aria-label="Interval day"
          className="data-[state=on]:bg-transparent data-[state=on]:text-foreground justify-start gap-2"
        >
          {selectedInterval === 'Day' ? <SquareCheck /> : <Square />}
          Day
        </Toggle>
        <Toggle
          pressed={selectedInterval === 'Week'}
          onPressedChange={() => handleIntervalSelect('Week')}
          aria-label="Interval week"
          className="data-[state=on]:bg-transparent data-[state=on]:text-foreground justify-start gap-2"
        >
          {selectedInterval === 'Week' ? <SquareCheck /> : <Square />}
          Week
        </Toggle>
      </PopoverContent>
    </Popover>
  )
}
