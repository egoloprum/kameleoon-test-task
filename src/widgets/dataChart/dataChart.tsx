import { CartesianGrid, Line, LineChart, AreaChart, XAxis, YAxis, ReferenceLine } from 'recharts'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/components/ui/chart'
import { chartData } from './charthelper'

const variations = [
  {
    name: 'Original',
  },
  {
    id: 10001,
    name: 'Variation A',
  },
  {
    id: 10002,
    name: 'Variation B',
  },
  {
    id: 10003,
    name: 'Variation C',
  },
]

const transformedChartData = chartData.map(item => {
  const calculateConversionRate = (variationId: string) => {
    const visits = item.visits[variationId] || 0
    const conversions = item.conversions[variationId] || 0
    // Avoid division by zero
    return visits > 0 ? (conversions / visits) * 100 : 0
  }

  return {
    date: item.date,
    // Conversion rates as percentages
    original: calculateConversionRate('0'),
    variationA: calculateConversionRate('10001'),
    variationB: calculateConversionRate('10002'),
    variationC: calculateConversionRate('10003'),
    // Keep original data for tooltip
    originalVisits: item.visits['0'] || 0,
    originalConversions: item.conversions['0'] || 0,
    variationAVisits: item.visits['10001'] || 0,
    variationAConversions: item.conversions['10001'] || 0,
    variationBVisits: item.visits['10002'] || 0,
    variationBConversions: item.conversions['10002'] || 0,
    variationCVisits: item.visits['10003'] || 0,
    variationCConversions: item.conversions['10003'] || 0,
  }
})

const chartConfig = {
  conversionRate: {
    label: 'Conversion Rate',
  },
  original: {
    label: 'Original',
    color: 'var(--chart-1)',
  },
  variationA: {
    label: 'Variation A',
    color: 'var(--chart-2)',
  },
  variationB: {
    label: 'Variation B',
    color: 'var(--chart-3)',
  },
  variationC: {
    label: 'Variation C',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig

interface DataChartProps {
  selectedVariations: string[]
}

export const DataChart = ({ selectedVariations }: DataChartProps) => {
  const visibleVariations = variations.filter(variation =>
    selectedVariations.includes(variation.name)
  )

  return (
    <div>
      <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
        <LineChart
          accessibilityLayer
          data={transformedChartData}
          margin={{
            left: 12,
            right: 12,
            top: 12,
            bottom: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={value => {
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
            content={
              <ChartTooltipContent
                className="min-w-[200px]"
                labelFormatter={value => {
                  return new Date(value).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                }}
                formatter={(value, name) => {
                  const variationName = name as string
                  const variation =
                    variations.find(
                      v => v.name.toLowerCase().replace(' ', '') === variationName.toLowerCase()
                    ) || variations[0]

                  // Find the data point for this date
                  const dataPoint = transformedChartData.find(item => item.date === value)

                  if (!dataPoint) return [value, name]

                  // Get visits and conversions for this variation
                  const visits = dataPoint[
                    `${variationName
                      .toLowerCase()
                      .replace(' ', '')}Visits` as keyof typeof dataPoint
                  ] as number
                  const conversions = dataPoint[
                    `${variationName
                      .toLowerCase()
                      .replace(' ', '')}Conversions` as keyof typeof dataPoint
                  ] as number

                  return [
                    <div key={variationName} className="flex flex-col">
                      <span className="font-medium">
                        {typeof value === 'number' ? `${value.toFixed(2)}%` : value}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {conversions} / {visits}
                      </span>
                    </div>,
                    variation.name,
                  ]
                }}
              />
            }
            cursor={<ReferenceLine x={0} stroke="var(--border)" strokeWidth={1} />}
          />
          {/* Render lines for each selected variation */}
          {visibleVariations.map(variation => {
            const dataKey = variation.name.toLowerCase().replace(' ', '')
            return (
              <Line
                key={dataKey}
                dataKey={dataKey}
                type="monotone"
                stroke={`var(--color-${dataKey})`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            )
          })}
        </LineChart>
      </ChartContainer>
    </div>
  )
}
