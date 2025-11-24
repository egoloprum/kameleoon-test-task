import { Button } from '@/shared/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group'
import { Square, SquareCheck } from 'lucide-react'
import { useState } from 'react'

export const VariationSelector = ({}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [selectedVariations, setSelectedVariations] = useState<string[]>([
    'Original',
    'Variation A',
    'Variation B',
    'Variation C',
  ])

  const variations = [
    {
      id: 1,
      value: 'Original',
    },
    {
      id: 2,
      value: 'Variation A',
    },
    {
      id: 3,
      value: 'Variation B',
    },
    {
      id: 4,
      value: 'Variation C',
    },
  ]

  const handleVariationChange = (values: string[]) => {
    // Ensure at least one variation is always selected
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
              className="data-[state=on]:bg-transparent data-[state=on]:text-foreground w-full justify-start gap-2"
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
