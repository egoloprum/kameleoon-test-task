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
import styles from './DataChart.module.css'

interface Variation {
  id: number
  name: string
  colorStroke: string
  colorFill: string
}

interface DataChartProps {
  selectedVariations: string[]
  selectedLineStyle: 'Line' | 'Smooth' | 'Area'
  selectedInterval: 'Day' | 'Week'
}

interface TransformedDataItem {
  date: string
  [key: string]: number | string
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    dataKey: string
    value?: number
    payload: Record<string, unknown>
  }>
  label?: string
  selectedInterval: 'Day' | 'Week'
}

const variations: Variation[] = [
  {
    id: 0,
    name: 'Original',
    colorStroke: 'var(--chart-stroke-original)',
    colorFill: 'var(--chart-fill-original)',
  },
  {
    id: 10001,
    name: 'Variation A',
    colorStroke: 'var(--chart-stroke-variation-a)',
    colorFill: 'var(--chart-fill-variation-a)',
  },
  {
    id: 10002,
    name: 'Variation B',
    colorStroke: 'var(--chart-stroke-variation-b)',
    colorFill: 'var(--chart-fill-variation-b)',
  },
  {
    id: 10003,
    name: 'Variation C',
    colorStroke: 'var(--chart-stroke-variation-c)',
    colorFill: 'var(--chart-fill-variation-c)',
  },
]

const variationMap = variations.reduce((acc, variation) => {
  acc[variation.name] = variation
  return acc
}, {} as Record<string, Variation>)

const CustomTooltip = ({ active, payload, label, selectedInterval }: TooltipProps) => {
  if (!active || !payload) return null

  const sortedPayload = [...payload].sort((a, b) => (b.value || 0) - (a.value || 0))

  let displayDate = ''
  if (selectedInterval === 'Week' && label) {
    const match = (label as string).match(/(\d{4})-W(\d{2})/)
    if (match) {
      displayDate = `Week of ${match[2]}/${match[1]}`
    } else {
      displayDate = label
    }
  } else if (label) {
    const date = new Date(label)
    displayDate = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <article className={styles.tooltip}>
      <header className={styles.tooltipHeader}>
        <Calendar className={styles.tooltipIcon} />
        <span>{displayDate}</span>
      </header>

      <hr className={styles.tooltipDivider} />

      <ul className={styles.tooltipList}>
        {sortedPayload.map((entry, index) => {
          const variationName = entry.dataKey as string
          const variation = variationMap[variationName]
          if (!variation) return null

          return (
            <li key={variationName} className={styles.tooltipItem}>
              <div className={styles.tooltipItemContent}>
                <div className={styles.tooltipLeft}>
                  <span
                    className={styles.colorDot}
                    style={{ backgroundColor: variation.colorStroke }}
                  />
                  <span className={styles.variationName}>{variation.name}</span>
                  {index === 0 && <Trophy className={styles.trophyIcon} />}
                </div>
                <strong className={styles.percentage}>{entry.value?.toFixed(2)}%</strong>
              </div>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

export const DataChart = ({
  selectedVariations,
  selectedLineStyle,
  selectedInterval,
}: DataChartProps) => {
  const intervalData = transformDataByInterval(chartData, variations, selectedInterval)

  const transformedChartData: TransformedDataItem[] = intervalData.map(item => {
    const calculateConversionRate = (variationId: string): number => {
      try {
        const visits = safeGet(item.visits, variationId)
        const conversions = safeGet(item.conversions, variationId)
        return visits > 0 ? (conversions / visits) * 100 : 0
      } catch (error) {
        console.warn(`Error calculating conversion rate for variation ${variationId}:`, error)
        return 0
      }
    }

    const dataPoint: TransformedDataItem = {
      date: item.date,
    }

    variations.forEach(variation => {
      try {
        const variationId = variation.id === 0 ? '0' : variation.id.toString()
        const dataKey = variation.name
        dataPoint[dataKey] = calculateConversionRate(variationId)

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

  const ChartComponent = selectedLineStyle === 'Area' ? AreaChart : LineChart
  const lineType = selectedLineStyle === 'Line' ? 'linear' : 'monotone'

  const renderChartElement = (variation: Variation) => {
    if (selectedLineStyle === 'Area') {
      return (
        <Area
          key={variation.name}
          dataKey={variation.name}
          type="monotone"
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

  return (
    <figure>
      <ChartContainer config={chartConfig} className={styles.chartContainer}>
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
          <CartesianGrid vertical={false} horizontal={true} stroke="var(--border)" />
          {transformedChartData.map((entry, index) => (
            <ReferenceLine
              key={index}
              x={entry.date}
              stroke="var(--border)"
              strokeDasharray="5 5"
            />
          ))}
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={selectedInterval === 'Week' ? 16 : 32}
            tickFormatter={value => {
              if (selectedInterval === 'Week') {
                const match = String(value).match(/(\d{4})-W(\d{2})/)
                if (match) {
                  return `W${match[2]}`
                }
                return String(value)
              }
              const date = new Date(String(value))
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
            tickFormatter={value => `${Number(value).toFixed(0)}%`}
            width={50}
          />
          <ChartTooltip
            content={<CustomTooltip selectedInterval={selectedInterval} />}
            cursor={<ReferenceLine x={0} stroke="var(--border)" strokeWidth={1} />}
          />
          {visibleVariations.map(renderChartElement)}
        </ChartComponent>
      </ChartContainer>
    </figure>
  )
}

const chartConfig = {
  conversionRate: {
    label: 'Conversion Rate',
  },
  Original: {
    label: 'Original',
    color: 'var(--chart-stroke-original)',
  },
  'Variation A': {
    label: 'Variation A',
    color: 'var(--chart-stroke-variation-a)',
  },
  'Variation B': {
    label: 'Variation B',
    color: 'var(--chart-stroke-variation-b)',
  },
  'Variation C': {
    label: 'Variation C',
    color: 'var(--chart-stroke-variation-c)',
  },
} satisfies ChartConfig
