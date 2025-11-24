import {
  CartesianGrid,
  Line,
  LineChart,
  AreaChart,
  XAxis,
  YAxis,
  ReferenceLine,
  Area,
} from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip } from '@/shared/components/ui/chart'
import { chartData } from './chartData'
import { safeGet, transformDataByInterval } from './charthelper'
import { Calendar, Trophy } from 'lucide-react'

const variations = [
  {
    id: 0,
    name: 'Original',
    colorStroke: '#4142EF',
    colorFill: '3838E7',
  },
  {
    id: 10001,
    name: 'Variation A',
    colorStroke: '#46464F',
    colorFill: '303039',
  },
  {
    id: 10002,
    name: 'Variation B',
    colorStroke: '#FF8346',
    colorFill: '#FF661A',
  },
  {
    id: 10003,
    name: 'Variation C',
    colorStroke: '#35BDAD',
    colorFill: '#7cebdeff',
  },
]

interface DataChartProps {
  selectedVariations: string[]
  selectedLineStyle: 'Line' | 'Smooth' | 'Area'
  selectedInterval: 'Day' | 'Week'
}

export const DataChart = ({
  selectedVariations,
  selectedLineStyle,
  selectedInterval,
}: DataChartProps) => {
  const intervalData = transformDataByInterval(chartData, variations, selectedInterval)

  const transformedChartData = intervalData.map(item => {
    const calculateConversionRate = (variationId: string) => {
      try {
        const visits = safeGet(item.visits, variationId)
        const conversions = safeGet(item.conversions, variationId)
        return visits > 0 ? (conversions / visits) * 100 : 0
      } catch (error) {
        console.warn(`Error calculating conversion rate for variation ${variationId}:`, error)
        return 0
      }
    }

    const dataPoint: any = {
      date: item.date,
    }

    variations.forEach(variation => {
      try {
        const variationId = variation.id === 0 ? '0' : variation.id.toString()
        const dataKey = variation.name
        dataPoint[dataKey] = calculateConversionRate(variationId)

        // Keep original data for tooltip
        dataPoint[`${dataKey}Visits`] = safeGet(item.visits, variationId)
        dataPoint[`${dataKey}Conversions`] = safeGet(item.conversions, variationId)
      } catch {
        const dataKey = variation.name
        dataPoint[dataKey] = 0
        dataPoint[`${dataKey}Visits`] = 0
        dataPoint[`${dataKey}Conversions`] = 0
      }
    })

    return dataPoint
  })

  const visibleVariations = variations.filter(variation =>
    selectedVariations.includes(variation.name)
  )

  // Determine chart type and line type based on selected line style
  const ChartComponent = selectedLineStyle === 'Area' ? AreaChart : LineChart
  const lineType = selectedLineStyle === 'Smooth' ? 'monotone' : 'linear'

  const renderChartElement = (variation: (typeof variations)[0]) => {
    if (selectedLineStyle === 'Area') {
      return (
        <Area
          key={variation.name}
          dataKey={variation.name}
          type={lineType}
          stroke={variation.colorStroke}
          fill={variation.colorFill}
          fillOpacity={0.3}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      )
    } else {
      return (
        <Line
          key={variation.name}
          dataKey={variation.name}
          type={lineType}
          stroke={variation.colorStroke}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      )
    }
  }

  // Create a mapping for tooltip data access
  const variationMap = variations.reduce((acc, variation) => {
    const key = variation.name
    acc[key] = variation
    return acc
  }, {} as Record<string, (typeof variations)[0]>)

  const CustomTooltip = ({ active, payload, label, selectedInterval }: any) => {
    if (!active || !payload) return null

    // Sort payload by value in descending order
    const sortedPayload = [...payload].sort((a, b) => (b.value || 0) - (a.value || 0))

    const match = label.match(/(\d{4})-W(\d{2})/)

    return (
      <div className="min-w-[200px] rounded border bg-background p-3 shadow-sm">
        <div className="mb-2 font-medium flex gap-2 items-center">
          <Calendar className="w-4 h-4" />
          {selectedInterval === 'Week'
            ? `Week of ${match[2]}/${match[1]}`
            : new Date(label).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
              })}
        </div>
        <div className="space-y-2">
          {sortedPayload.map((entry, index) => {
            const variationName = entry.dataKey as string
            const variation = variationMap[variationName]
            if (!variation) return null

            return (
              <>
                <hr />
                <div
                  key={variationName}
                  className="flex justify-between items-center border border-dashed py-1"
                >
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: variation.colorStroke }}
                    />
                    <span className="text-xs">{variation.name}</span>
                    {index === 0 ? <Trophy className="w-4 h-4" /> : ''}
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{entry.value?.toFixed(2)}%</span>
                  </div>
                </div>
              </>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div>
      <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
        <ChartComponent
          accessibilityLayer
          data={transformedChartData}
          margin={{
            left: -12,
            right: 12,
            top: 12,
            bottom: 12,
          }}
        >
          <CartesianGrid vertical={false} horizontal={true} stroke="#e0e0e0" />
          {/* Add custom vertical dotted lines */}
          {transformedChartData.map((entry, index) => (
            <ReferenceLine key={index} x={entry.date} stroke="#e0e0e0" strokeDasharray="5 5" />
          ))}
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={selectedInterval === 'Week' ? 16 : 32}
            tickFormatter={value => {
              if (selectedInterval === 'Week') {
                // For week format: "2025-W01"
                const match = value.match(/(\d{4})-W(\d{2})/)
                if (match) {
                  return `W${match[2]}`
                }
                return value
              }
              const date = new Date(value)
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={value => `${value.toFixed(0)}%`}
            width={50}
          />
          <ChartTooltip
            content={<CustomTooltip selectedInterval={selectedInterval} />}
            cursor={<ReferenceLine x={0} stroke="var(--border)" strokeWidth={1} />}
          />
          {/* Render chart elements for each selected variation */}
          {visibleVariations.map(renderChartElement)}
        </ChartComponent>
      </ChartContainer>
    </div>
  )
}

const chartConfig = {
  conversionRate: {
    label: 'Conversion Rate',
  },
  original: {
    label: 'Original',
    color: '#4142EF',
  },
  variationA: {
    label: 'Variation A',
    color: '#46464F',
  },
  variationB: {
    label: 'Variation B',
    color: '#FF8346',
  },
  variationC: {
    label: 'Variation C',
    color: '#35BDAD',
  },
} satisfies ChartConfig
