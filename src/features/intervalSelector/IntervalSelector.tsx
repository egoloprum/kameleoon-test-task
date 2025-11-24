import { Button } from '@/shared/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Toggle } from '@/shared/components/ui/toggle'
import { Square, SquareCheck } from 'lucide-react'
import { useState } from 'react'

export const IntervalSelector = ({}) => {
  const [selectInterval, setSelectInterval] = useState<'Day' | 'Week'>('Day')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleIntervalSelect = (interval: 'Day' | 'Week') => {
    setSelectInterval(interval)
    setIsPopoverOpen(false) // Close popover on select
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild className="w-20">
        <Button variant="outline">{selectInterval}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit flex flex-col">
        <Toggle
          pressed={selectInterval === 'Day'}
          onPressedChange={() => handleIntervalSelect('Day')}
          aria-label="Interval day"
          className="data-[state=on]:bg-transparent data-[state=on]:text-foreground justify-start gap-2"
        >
          {selectInterval === 'Day' ? <SquareCheck /> : <Square />}
          Day
        </Toggle>
        <Toggle
          pressed={selectInterval === 'Week'}
          onPressedChange={() => handleIntervalSelect('Week')}
          aria-label="Interval week"
          className="data-[state=on]:bg-transparent data-[state=on]:text-foreground justify-start gap-2"
        >
          {selectInterval === 'Week' ? <SquareCheck /> : <Square />}
          Week
        </Toggle>
      </PopoverContent>
    </Popover>
  )
}
