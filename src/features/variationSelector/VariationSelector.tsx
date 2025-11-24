import { Button } from '@/shared/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group'
import { useAppContext } from '@/shared/lib/context'
import { Square, SquareCheck } from 'lucide-react'
import { useState } from 'react'

const variations = [
  {
    id: 0,
    value: 'Original',
  },
  {
    id: 10001,
    value: 'Variation A',
  },
  {
    id: 10002,
    value: 'Variation B',
  },
  {
    id: 10003,
    value: 'Variation C',
  },
]

export const VariationSelector = () => {
  const { selectedVariations, setSelectedVariations } = useAppContext()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleVariationChange = (values: string[]) => {
    if (values.length > 0) {
      setSelectedVariations(values)
    }
  }

  const getTriggerText = () => {
    if (selectedVariations.length === 1) {
      return selectedVariations[0]
    } else if (selectedVariations.length === variations.length) {
      return 'All variations are selected'
    } else {
      return `${selectedVariations.length} variations selected`
    }
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild className="w-50">
        <Button variant="outline">{getTriggerText()}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <ToggleGroup
          type="multiple"
          variant="outline"
          spacing={2}
          size="sm"
          className="flex flex-col"
          value={selectedVariations}
          onValueChange={handleVariationChange}
        >
          {variations.map(variation => (
            <ToggleGroupItem
              key={variation.id}
              value={variation.value}
              aria-label={`Select ${variation.value}`}
              className="w-full justify-start gap-2 shadow-none border-none"
            >
              {selectedVariations.includes(variation.value) ? <SquareCheck /> : <Square />}
              {variation.value}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  )
}
