import React, { createContext, useContext, useState, type ReactNode } from 'react'

type Interval = 'Day' | 'Week'
type LineStyle = 'Line' | 'Smooth' | 'Area'

interface AppContextType {
  // Interval state
  selectedInterval: Interval
  setSelectedInterval: (interval: Interval) => void

  // Line style state
  selectedLineStyle: LineStyle
  setSelectedLineStyle: (style: LineStyle) => void

  // Variations state
  selectedVariations: string[]
  setSelectedVariations: (variations: string[]) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [selectedInterval, setSelectedInterval] = useState<Interval>('Day')
  const [selectedLineStyle, setSelectedLineStyle] = useState<LineStyle>('Line')
  const [selectedVariations, setSelectedVariations] = useState<string[]>([
    'Original',
    'Variation A',
    'Variation B',
    'Variation C',
  ])

  const value = {
    selectedInterval,
    setSelectedInterval,
    selectedLineStyle,
    setSelectedLineStyle,
    selectedVariations,
    setSelectedVariations,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
