import { Button } from '@/shared/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { ToggleGroup, ToggleGroupItem } from '@/shared/components/ui/toggle-group'
import { useAppContext } from '@/shared/lib/context'
import { ChevronDown, Square, SquareCheck } from 'lucide-react'
import { useState } from 'react'
import styles from './VariationSelector.module.css'

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
      <PopoverTrigger asChild className={styles.popoverTrigger}>
        <Button variant="outline">
          {getTriggerText()}
          <ChevronDown className={`${styles.chevron} ${isPopoverOpen ? styles.chevronOpen : ''}`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={styles.popoverContent}>
        <ToggleGroup
          type="multiple"
          variant="outline"
          spacing={2}
          size="sm"
          className={styles.toggleGroup}
          value={selectedVariations}
          onValueChange={handleVariationChange}
        >
          {variations.map(variation => (
            <ToggleGroupItem
              key={variation.id}
              value={variation.value}
              aria-label={`Select ${variation.value}`}
              className={styles.toggleGroupItem}
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
