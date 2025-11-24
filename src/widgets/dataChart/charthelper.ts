interface ChartDataItem {
  date: string
  visits: Record<string, number>
  conversions: Record<string, number>
}

interface Variation {
  id: number
  name: string
  colorStroke: string
  colorFill: string
}

interface WeeklyDataItem extends ChartDataItem {
  count: number
}

export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

export const safeGet = (obj: unknown, key: string, defaultValue: number = 0): number => {
  if (!obj || typeof obj !== 'object' || obj === null) return defaultValue
  return key in obj && typeof (obj as Record<string, unknown>)[key] === 'number'
    ? (obj as Record<string, number>)[key]
    : defaultValue
}

// Transform data based on selected interval (Day/Week)
export const transformDataByInterval = (
  data: ChartDataItem[],
  variations: Variation[],
  interval: 'Day' | 'Week'
): ChartDataItem[] => {
  if (interval === 'Day') {
    return data
  }

  // For Week interval, group data by week
  const weeklyDataMap = new Map<string, WeeklyDataItem>()

  data.forEach((item: ChartDataItem) => {
    try {
      const date = new Date(item.date)
      const weekNumber = getWeekNumber(date)
      const year = date.getFullYear()
      const weekKey = `${year}-W${weekNumber.toString().padStart(2, '0')}`

      if (!weeklyDataMap.has(weekKey)) {
        weeklyDataMap.set(weekKey, {
          date: weekKey,
          visits: {},
          conversions: {},
          count: 0,
        })
      }

      const weekData = weeklyDataMap.get(weekKey)!
      weekData.count++

      // Sum up visits and conversions for each variation
      variations.forEach((variation: Variation) => {
        const variationId = variation.id === 0 ? '0' : variation.id.toString()
        const visits = safeGet(item.visits, variationId)
        const conversions = safeGet(item.conversions, variationId)

        weekData.visits[variationId] = (safeGet(weekData.visits, variationId) || 0) + visits
        weekData.conversions[variationId] =
          (safeGet(weekData.conversions, variationId) || 0) + conversions
      })
    } catch (error) {
      console.warn('Error processing data item:', item, error)
    }
  })

  // Convert to array and calculate averages
  const weeklyData: ChartDataItem[] = Array.from(weeklyDataMap.values()).map(
    (weekItem: WeeklyDataItem) => {
      const averagedItem: ChartDataItem = {
        date: weekItem.date,
        visits: {},
        conversions: {},
      }

      variations.forEach((variation: Variation) => {
        const variationId = variation.id === 0 ? '0' : variation.id.toString()
        const avgVisits = Math.round(safeGet(weekItem.visits, variationId) / weekItem.count)
        const avgConversions = Math.round(
          safeGet(weekItem.conversions, variationId) / weekItem.count
        )

        averagedItem.visits[variationId] = avgVisits
        averagedItem.conversions[variationId] = avgConversions
      })

      return averagedItem
    }
  )

  return weeklyData.sort((a, b) => a.date.localeCompare(b.date))
}
